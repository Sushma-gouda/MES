from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import WorkCenter, ProductionSchedule, ProductionOrder, Product
from schemas import (
    WorkCenterResponse,
    ProductionScheduleCreate,
    ProductionScheduleResponse,
    ProductionScheduleListResponse,
)

router = APIRouter(
    prefix="/production-schedules",
    tags=["Production Scheduling"],
)


# Get all active work centers
@router.get("/work-centers", response_model=list[WorkCenterResponse])
def get_work_centers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(WorkCenter)
        .filter(WorkCenter.is_active == True)
        .order_by(WorkCenter.code)
        .all()
    )


# Get all production schedules
@router.get("/", response_model=list[ProductionScheduleListResponse])
def get_schedules(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    schedules = (
        db.query(
            ProductionSchedule.id,
            ProductionSchedule.production_order_id,
            ProductionOrder.order_number,
            Product.product_code,
            Product.product_name,
            ProductionSchedule.work_center_id,
            WorkCenter.code.label("work_center_code"),
            WorkCenter.name.label("work_center_name"),
            ProductionSchedule.sequence_number,
            ProductionSchedule.planned_start,
            ProductionSchedule.planned_end,
            ProductionSchedule.status,
            ProductionSchedule.notes,
        )
        .join(
            ProductionOrder,
            ProductionSchedule.production_order_id == ProductionOrder.id,
        )
        .join(
            Product,
            ProductionOrder.product_id == Product.id,
        )
        .join(
            WorkCenter,
            ProductionSchedule.work_center_id == WorkCenter.id,
        )
        .order_by(
            ProductionSchedule.planned_start,
            ProductionSchedule.sequence_number,
        )
        .all()
    )

    return schedules


# Create a production schedule
@router.post(
    "/",
    response_model=ProductionScheduleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_schedule(
    schedule_data: ProductionScheduleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Check production order
    order = (
        db.query(ProductionOrder)
        .filter(
            ProductionOrder.id == schedule_data.production_order_id
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Production order not found",
        )

    # Only released orders can be scheduled
    if order.status != "RELEASED":
        raise HTTPException(
            status_code=400,
            detail="Only RELEASED production orders can be scheduled",
        )

    # Check work center
    work_center = (
        db.query(WorkCenter)
        .filter(
            WorkCenter.id == schedule_data.work_center_id,
            WorkCenter.is_active == True,
        )
        .first()
    )

    if not work_center:
        raise HTTPException(
            status_code=404,
            detail="Active work center not found",
        )

    # Validate planned dates
    if schedule_data.planned_end <= schedule_data.planned_start:
        raise HTTPException(
            status_code=400,
            detail="Planned end must be after planned start",
        )

    schedule = ProductionSchedule(
        production_order_id=schedule_data.production_order_id,
        work_center_id=schedule_data.work_center_id,
        sequence_number=schedule_data.sequence_number,
        planned_start=schedule_data.planned_start,
        planned_end=schedule_data.planned_end,
        status="PLANNED",
        notes=schedule_data.notes,
    )

    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return schedule


# Update a production schedule
@router.put(
    "/{schedule_id}",
    response_model=ProductionScheduleResponse,
)
def update_schedule(
    schedule_id: int,
    schedule_data: ProductionScheduleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    schedule = (
        db.query(ProductionSchedule)
        .filter(ProductionSchedule.id == schedule_id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule not found",
        )

    if schedule.status == "DISPATCHED":
        raise HTTPException(
            status_code=400,
            detail="Dispatched schedules cannot be edited",
        )

    work_center = (
        db.query(WorkCenter)
        .filter(
            WorkCenter.id == schedule_data.work_center_id,
            WorkCenter.is_active == True,
        )
        .first()
    )

    if not work_center:
        raise HTTPException(
            status_code=404,
            detail="Active work center not found",
        )

    if schedule_data.planned_end <= schedule_data.planned_start:
        raise HTTPException(
            status_code=400,
            detail="Planned end must be after planned start",
        )

    schedule.work_center_id = schedule_data.work_center_id
    schedule.sequence_number = schedule_data.sequence_number
    schedule.planned_start = schedule_data.planned_start
    schedule.planned_end = schedule_data.planned_end
    schedule.notes = schedule_data.notes

    db.commit()
    db.refresh(schedule)

    return schedule


# Dispatch a scheduled order
@router.post(
    "/{schedule_id}/dispatch",
    response_model=ProductionScheduleResponse,
)
def dispatch_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    schedule = (
        db.query(ProductionSchedule)
        .filter(ProductionSchedule.id == schedule_id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Schedule not found",
        )

    if schedule.status != "PLANNED":
        raise HTTPException(
            status_code=400,
            detail="Only PLANNED schedules can be dispatched",
        )

    schedule.status = "DISPATCHED"

    db.commit()
    db.refresh(schedule)

    return schedule