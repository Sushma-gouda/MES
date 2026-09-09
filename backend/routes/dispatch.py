from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import get_db
from dependencies import get_current_user
from models import (
    ProductionOrder,
    ProductionSchedule,
    FeasibilityCheck,
    MESDispatchQueue,
    WorkCenter,
    Product
)
from schemas import (
    MESDispatchCreate,
    MESDispatchResponse,
    DispatchEligibleScheduleResponse,
)

router = APIRouter(
    prefix="/dispatch-mes",
    tags=["MES Dispatch Queue"],
)

@router.get("/eligible", response_model=list[DispatchEligibleScheduleResponse])
def get_eligible_schedules(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Fetch all production schedules
    schedules = db.query(ProductionSchedule).all()
    eligible_list = []

    for schedule in schedules:
        # Check if already dispatched
        dispatched = db.query(MESDispatchQueue).filter(MESDispatchQueue.production_schedule_id == schedule.id).first()
        is_dispatched = dispatched is not None

        # Fetch latest feasibility check
        latest_check = db.query(FeasibilityCheck).filter(
            FeasibilityCheck.production_schedule_id == schedule.id
        ).order_by(desc(FeasibilityCheck.checked_at)).first()

        feasibility_status = "NOT CHECKED"
        overall_feasible = False
        if latest_check:
            overall_feasible = latest_check.overall_feasible
            feasibility_status = "FEASIBLE" if overall_feasible else "NOT FEASIBLE"

        # Check if production order exists
        order = db.query(ProductionOrder).filter(ProductionOrder.id == schedule.production_order_id).first()
        if not order:
            continue

        product = db.query(Product).filter(Product.id == order.product_id).first()
        product_name = product.product_name if product else "Unknown"

        work_center = db.query(WorkCenter).filter(WorkCenter.id == schedule.work_center_id).first()
        work_center_code = work_center.code if work_center else "Unknown"

        eligible_list.append(
            DispatchEligibleScheduleResponse(
                production_schedule_id=schedule.id,
                production_order_id=order.id,
                order_number=order.order_number,
                product_name=product_name,
                quantity=order.quantity,
                priority=order.priority,
                work_center_code=work_center_code,
                planned_start=schedule.planned_start,
                planned_end=schedule.planned_end,
                feasibility_status=feasibility_status,
                is_dispatched=is_dispatched,
            )
        )

    return eligible_list

@router.get("/queue", response_model=list[MESDispatchResponse])
def get_dispatch_queue(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(MESDispatchQueue).order_by(desc(MESDispatchQueue.dispatched_at)).all()

@router.post("/dispatch/{schedule_id}", response_model=MESDispatchResponse, status_code=status.HTTP_201_CREATED)
def dispatch_schedule_to_mes(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    schedule = db.query(ProductionSchedule).filter(ProductionSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Production schedule not found")

    order = db.query(ProductionOrder).filter(ProductionOrder.id == schedule.production_order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Associated production order not found")

    latest_check = db.query(FeasibilityCheck).filter(
        FeasibilityCheck.production_schedule_id == schedule.id
    ).order_by(desc(FeasibilityCheck.checked_at)).first()

    if not latest_check:
        raise HTTPException(status_code=400, detail="Schedule has not been checked for feasibility")

    if not latest_check.overall_feasible:
        raise HTTPException(status_code=400, detail="Cannot dispatch schedule that is NOT FEASIBLE")

    existing_dispatch = db.query(MESDispatchQueue).filter(MESDispatchQueue.production_schedule_id == schedule_id).first()
    if existing_dispatch:
        raise HTTPException(status_code=400, detail="Schedule is already in the dispatch queue")

    dispatch_entry = MESDispatchQueue(
        production_schedule_id=schedule.id,
        production_order_id=order.id,
        status="DISPATCHED",
        dispatched_by=current_user.name,
    )
    
    db.add(dispatch_entry)
    db.commit()
    db.refresh(dispatch_entry)

    return dispatch_entry
