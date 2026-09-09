from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import (
    MachineCapacity,
    LaborAvailability,
    Tool,
    CapacityRequirement,
    FeasibilityCheck,
    ProductionSchedule,
    WorkCenter,
)
from schemas import (
    MachineCapacityCreate,
    MachineCapacityResponse,
    LaborAvailabilityCreate,
    LaborAvailabilityResponse,
    ToolCreate,
    ToolResponse,
    CapacityRequirementCreate,
    CapacityRequirementResponse,
    FeasibilityCheckResponse,
)

router = APIRouter(
    prefix="/capacity-planning",
    tags=["Capacity Planning & Feasibility"],
)


# ---------------------------------------------------------
# MACHINE CAPACITY
# ---------------------------------------------------------

@router.get(
    "/machine-capacities",
    response_model=list[MachineCapacityResponse],
)
def get_machine_capacities(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(MachineCapacity)
        .order_by(
            MachineCapacity.available_date,
            MachineCapacity.work_center_id,
        )
        .all()
    )


@router.post(
    "/machine-capacities",
    response_model=MachineCapacityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_machine_capacity(
    capacity_data: MachineCapacityCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    work_center = (
        db.query(WorkCenter)
        .filter(
            WorkCenter.id == capacity_data.work_center_id,
            WorkCenter.is_active == True,
        )
        .first()
    )

    if not work_center:
        raise HTTPException(
            status_code=404,
            detail="Active work center not found",
        )

    if capacity_data.used_hours > capacity_data.available_hours:
        raise HTTPException(
            status_code=400,
            detail="Used hours cannot exceed available hours",
        )

    capacity = MachineCapacity(
        work_center_id=capacity_data.work_center_id,
        available_date=capacity_data.available_date,
        available_hours=capacity_data.available_hours,
        used_hours=capacity_data.used_hours,
    )

    db.add(capacity)
    db.commit()
    db.refresh(capacity)

    return capacity


# ---------------------------------------------------------
# LABOR AVAILABILITY
# ---------------------------------------------------------

@router.get(
    "/labor-availability",
    response_model=list[LaborAvailabilityResponse],
)
def get_labor_availability(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(LaborAvailability)
        .order_by(
            LaborAvailability.available_date,
            LaborAvailability.work_center_id,
        )
        .all()
    )


@router.post(
    "/labor-availability",
    response_model=LaborAvailabilityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_labor_availability(
    labor_data: LaborAvailabilityCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    work_center = (
        db.query(WorkCenter)
        .filter(
            WorkCenter.id == labor_data.work_center_id,
            WorkCenter.is_active == True,
        )
        .first()
    )

    if not work_center:
        raise HTTPException(
            status_code=404,
            detail="Active work center not found",
        )

    if labor_data.used_hours > labor_data.available_hours:
        raise HTTPException(
            status_code=400,
            detail="Used labor hours cannot exceed available labor hours",
        )

    labor = LaborAvailability(
        work_center_id=labor_data.work_center_id,
        available_date=labor_data.available_date,
        available_hours=labor_data.available_hours,
        used_hours=labor_data.used_hours,
    )

    db.add(labor)
    db.commit()
    db.refresh(labor)

    return labor


# ---------------------------------------------------------
# TOOLS
# ---------------------------------------------------------

@router.get(
    "/tools",
    response_model=list[ToolResponse],
)
def get_tools(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(Tool)
        .order_by(Tool.tool_code)
        .all()
    )


@router.post(
    "/tools",
    response_model=ToolResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_tool(
    tool_data: ToolCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing_tool = (
        db.query(Tool)
        .filter(Tool.tool_code == tool_data.tool_code)
        .first()
    )

    if existing_tool:
        raise HTTPException(
            status_code=400,
            detail="Tool code already exists",
        )

    if tool_data.quantity_in_use > tool_data.quantity_available:
        raise HTTPException(
            status_code=400,
            detail="Quantity in use cannot exceed quantity available",
        )

    tool = Tool(
        tool_code=tool_data.tool_code,
        tool_name=tool_data.tool_name,
        quantity_available=tool_data.quantity_available,
        quantity_in_use=tool_data.quantity_in_use,
        is_active=tool_data.is_active,
    )

    db.add(tool)
    db.commit()
    db.refresh(tool)

    return tool


# ---------------------------------------------------------
# CAPACITY REQUIREMENTS
# ---------------------------------------------------------

@router.post(
    "/requirements",
    response_model=CapacityRequirementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_capacity_requirement(
    requirement_data: CapacityRequirementCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    schedule = (
        db.query(ProductionSchedule)
        .filter(
            ProductionSchedule.id
            == requirement_data.production_schedule_id
        )
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=404,
            detail="Production schedule not found",
        )

    if (
        requirement_data.required_end
        <= requirement_data.required_start
    ):
        raise HTTPException(
            status_code=400,
            detail="Required end must be after required start",
        )

    if requirement_data.required_tool_id is not None:
        tool = (
            db.query(Tool)
            .filter(
                Tool.id == requirement_data.required_tool_id,
                Tool.is_active == True,
            )
            .first()
        )

        if not tool:
            raise HTTPException(
                status_code=404,
                detail="Active required tool not found",
            )

        if requirement_data.required_tool_quantity <= 0:
            raise HTTPException(
                status_code=400,
                detail="Required tool quantity must be greater than zero",
            )

    requirement = CapacityRequirement(
        production_schedule_id=requirement_data.production_schedule_id,
        required_machine_hours=requirement_data.required_machine_hours,
        required_labor_hours=requirement_data.required_labor_hours,
        required_tool_id=requirement_data.required_tool_id,
        required_tool_quantity=requirement_data.required_tool_quantity,
        required_start=requirement_data.required_start,
        required_end=requirement_data.required_end,
    )

    db.add(requirement)
    db.commit()
    db.refresh(requirement)

    return requirement


# ---------------------------------------------------------
# FEASIBILITY CHECK
# ---------------------------------------------------------

@router.post(
    "/check/{schedule_id}",
    response_model=FeasibilityCheckResponse,
)
def check_schedule_feasibility(
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
            detail="Production schedule not found",
        )

    requirement = (
        db.query(CapacityRequirement)
        .filter(
            CapacityRequirement.production_schedule_id
            == schedule_id
        )
        .order_by(CapacityRequirement.id.desc())
        .first()
    )

    if not requirement:
        raise HTTPException(
            status_code=400,
            detail="Capacity requirement not found for this schedule",
        )

    work_center = (
        db.query(WorkCenter)
        .filter(WorkCenter.id == schedule.work_center_id)
        .first()
    )

    if not work_center:
        raise HTTPException(
            status_code=404,
            detail="Work center not found",
        )

    # -----------------------------------------------------
    # MACHINE CAPACITY
    # -----------------------------------------------------

    machine_capacities = (
        db.query(MachineCapacity)
        .filter(
            MachineCapacity.work_center_id
            == schedule.work_center_id,
            MachineCapacity.available_date
            >= requirement.required_start.date(),
            MachineCapacity.available_date
            <= requirement.required_end.date(),
        )
        .all()
    )

    available_machine_hours = sum(
        float(capacity.available_hours)
        - float(capacity.used_hours)
        for capacity in machine_capacities
    )

    required_machine_hours = float(
        requirement.required_machine_hours
    )

    machine_feasible = (
        available_machine_hours >= required_machine_hours
    )

    # -----------------------------------------------------
    # LABOR AVAILABILITY
    # -----------------------------------------------------

    labor_records = (
        db.query(LaborAvailability)
        .filter(
            LaborAvailability.work_center_id
            == schedule.work_center_id,
            LaborAvailability.available_date
            >= requirement.required_start.date(),
            LaborAvailability.available_date
            <= requirement.required_end.date(),
        )
        .all()
    )

    available_labor_hours = sum(
        float(labor.available_hours)
        - float(labor.used_hours)
        for labor in labor_records
    )

    required_labor_hours = float(
        requirement.required_labor_hours
    )

    labor_feasible = (
        available_labor_hours >= required_labor_hours
    )

    # -----------------------------------------------------
    # TOOL AVAILABILITY
    # -----------------------------------------------------

    tool_feasible = True

    if requirement.required_tool_id is not None:
        tool = (
            db.query(Tool)
            .filter(Tool.id == requirement.required_tool_id)
            .first()
        )

        if not tool:
            tool_feasible = False
        else:
            available_tool_quantity = (
                tool.quantity_available
                - tool.quantity_in_use
            )

            tool_feasible = (
                available_tool_quantity
                >= requirement.required_tool_quantity
            )

    # -----------------------------------------------------
    # DATE FEASIBILITY
    # -----------------------------------------------------

    schedule_duration = (
        schedule.planned_end - schedule.planned_start
    )

    date_feasible = (
        requirement.required_end
        <= schedule.planned_end
    )

    # -----------------------------------------------------
    # OVERALL RESULT
    # -----------------------------------------------------

    overall_feasible = (
        machine_feasible
        and labor_feasible
        and tool_feasible
        and date_feasible
    )

    reasons = []

    if not machine_feasible:
        reasons.append(
            "Insufficient machine capacity"
        )

    if not labor_feasible:
        reasons.append(
            "Insufficient labor availability"
        )

    if not tool_feasible:
        reasons.append(
            "Required tool is unavailable"
        )

    if not date_feasible:
        reasons.append(
            "Production cannot be completed within the planned date"
        )

    reason = (
        "; ".join(reasons)
        if reasons
        else "All capacity and feasibility checks passed"
    )

    feasibility_check = FeasibilityCheck(
        production_schedule_id=schedule_id,
        machine_feasible=machine_feasible,
        labor_feasible=labor_feasible,
        tool_feasible=tool_feasible,
        date_feasible=date_feasible,
        overall_feasible=overall_feasible,
        required_machine_hours=required_machine_hours,
        available_machine_hours=available_machine_hours,
        reason=reason,
        checked_by=current_user.name,
    )

    db.add(feasibility_check)
    db.commit()
    db.refresh(feasibility_check)

    return feasibility_check


# ---------------------------------------------------------
# FEASIBILITY HISTORY
# ---------------------------------------------------------

@router.get(
    "/checks",
    response_model=list[FeasibilityCheckResponse],
)
def get_feasibility_checks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(FeasibilityCheck)
        .order_by(FeasibilityCheck.checked_at.desc())
        .all()
    )
