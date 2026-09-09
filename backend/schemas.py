from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field


# =========================================================
# AUTHENTICATION SCHEMAS
# =========================================================

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    message: str
    access_token: str
    token_type: str


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str


# =========================================================
# MES MODULE 1 — ORDER RELEASE SCHEMAS
# =========================================================

class ProductionOrderCreate(BaseModel):
    """
    Data received when a production order enters MES.
    """

    order_number: str = Field(min_length=1, max_length=50)
    erp_order_number: str = Field(min_length=1, max_length=50)

    customer_id: int
    product_id: int

    quantity: int = Field(gt=0)
    due_date: datetime

    priority: str = "MEDIUM"

    bom_revision: str = Field(min_length=1, max_length=20)
    routing_revision: str = Field(min_length=1, max_length=20)


class ProductionOrderResponse(BaseModel):
    """
    Standard production order response.
    """

    id: int

    order_number: str
    erp_order_number: str

    customer_id: int
    product_id: int

    quantity: int
    produced_quantity: int
    remaining_quantity: int

    priority: str
    status: str

    due_date: datetime

    bom_revision: str
    routing_revision: str

    planned_start: datetime | None = None
    planned_end: datetime | None = None

    actual_start: datetime | None = None
    actual_end: datetime | None = None

    released_at: datetime | None = None
    released_by: str | None = None

    hold_reason: str | None = None

    created_at: datetime | None = None
    updated_at: datetime | None = None


class ProductionOrderDetailResponse(ProductionOrderResponse):
    """
    Detailed production order response.
    """

    customer_name: str
    customer_code: str

    product_name: str
    product_code: str
    product_revision: str

    class Config:
        from_attributes = True


class ProductionOrderListResponse(BaseModel):
    """
    Production order response used by the order list.
    """

    id: int

    order_number: str
    erp_order_number: str

    customer_name: str

    product_code: str
    product_name: str

    quantity: int
    produced_quantity: int
    remaining_quantity: int

    priority: str
    status: str

    due_date: datetime

    bom_revision: str
    routing_revision: str

    class Config:
        from_attributes = True


class HoldOrderRequest(BaseModel):
    """
    Reason for putting a production order on hold.
    """

    hold_reason: str = Field(min_length=1, max_length=500)


class CustomerResponse(BaseModel):
    id: int
    customer_code: str
    customer_name: str
    is_active: bool

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: int
    product_code: str
    product_name: str
    revision: str
    description: str | None = None
    is_active: bool

    class Config:
        from_attributes = True


class WorkCenterResponse(BaseModel):
    id: int
    code: str
    name: str
    line: str
    capacity_hours: int
    is_active: bool

    class Config:
        from_attributes = True


class ProductionScheduleCreate(BaseModel):
    production_order_id: int
    work_center_id: int
    sequence_number: int = Field(gt=0)
    planned_start: datetime
    planned_end: datetime
    notes: str | None = None


class ProductionScheduleResponse(BaseModel):
    id: int
    production_order_id: int
    work_center_id: int
    sequence_number: int
    planned_start: datetime
    planned_end: datetime
    status: str
    notes: str | None = None

    class Config:
        from_attributes = True


class ProductionScheduleListResponse(BaseModel):
    id: int
    production_order_id: int
    order_number: str
    product_code: str
    product_name: str
    work_center_id: int
    work_center_code: str
    work_center_name: str
    sequence_number: int
    planned_start: datetime
    planned_end: datetime
    status: str
    notes: str | None = None

#Module 3

class MachineCapacityCreate(BaseModel):
    work_center_id: int
    available_date: date
    available_hours: float = Field(ge=0)
    used_hours: float = Field(default=0, ge=0)


class MachineCapacityResponse(BaseModel):
    id: int
    work_center_id: int
    available_date: date
    available_hours: float
    used_hours: float

    class Config:
        from_attributes = True

class LaborAvailabilityCreate(BaseModel):
    work_center_id: int
    available_date: date
    available_hours: float = Field(ge=0)
    used_hours: float = Field(default=0, ge=0)


class LaborAvailabilityResponse(BaseModel):
    id: int
    work_center_id: int
    available_date: date
    available_hours: float
    used_hours: float

    class Config:
        from_attributes = True

class ToolCreate(BaseModel):
    tool_code: str = Field(min_length=1, max_length=50)
    tool_name: str = Field(min_length=1, max_length=100)
    quantity_available: int = Field(ge=0)
    quantity_in_use: int = Field(default=0, ge=0)
    is_active: bool = True


class ToolResponse(BaseModel):
    id: int
    tool_code: str
    tool_name: str
    quantity_available: int
    quantity_in_use: int
    is_active: bool

    class Config:
        from_attributes = True

class CapacityRequirementCreate(BaseModel):
    production_schedule_id: int
    required_machine_hours: float = Field(gt=0)
    required_labor_hours: float = Field(ge=0)
    required_tool_id: int | None = None
    required_tool_quantity: int = Field(default=0, ge=0)
    required_start: datetime
    required_end: datetime


class CapacityRequirementResponse(BaseModel):
    id: int
    production_schedule_id: int
    required_machine_hours: float
    required_labor_hours: float
    required_tool_id: int | None
    required_tool_quantity: int
    required_start: datetime
    required_end: datetime

    class Config:
        from_attributes = True

class FeasibilityCheckResponse(BaseModel):
    id: int
    production_schedule_id: int

    machine_feasible: bool
    labor_feasible: bool
    tool_feasible: bool
    date_feasible: bool

    overall_feasible: bool

    required_machine_hours: float
    available_machine_hours: float

    reason: str | None = None

    checked_at: datetime | None = None
    checked_by: str | None = None

    class Config:
        from_attributes = True

# =========================================================
# MES MODULE 4 — DISPATCH
# =========================================================

class MESDispatchCreate(BaseModel):
    production_schedule_id: int


class MESDispatchResponse(BaseModel):
    id: int
    production_schedule_id: int
    production_order_id: int
    status: str
    dispatched_at: datetime
    dispatched_by: str

    class Config:
        from_attributes = True


class DispatchEligibleScheduleResponse(BaseModel):
    production_schedule_id: int
    production_order_id: int
    order_number: str
    product_name: str
    quantity: int
    priority: str
    work_center_code: str
    planned_start: datetime
    planned_end: datetime
    feasibility_status: str
    is_dispatched: bool

#module 5
class MaterialCreate(BaseModel):
    material_code: str = Field(min_length=1, max_length=50)
    material_name: str = Field(min_length=1, max_length=150)
    unit: str = Field(min_length=1, max_length=20)
    available_quantity: float = Field(default=0, ge=0)
    reserved_quantity: float = Field(default=0, ge=0)
    is_active: bool = True


class MaterialResponse(BaseModel):
    id: int
    material_code: str
    material_name: str
    unit: str
    available_quantity: float
    reserved_quantity: float
    is_active: bool
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

class MaterialRequirementCreate(BaseModel):
    production_order_id: int
    material_id: int
    required_quantity: float = Field(gt=0)
    issued_quantity: float = Field(default=0, ge=0)
    status: str = "REQUIRED"

class MaterialRequirementResponse(BaseModel):
    id: int
    production_order_id: int
    material_id: int
    required_quantity: float
    issued_quantity: float
    status: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

class MaterialKitCreate(BaseModel):
    production_order_id: int
    work_center_id: int
    kit_number: str = Field(min_length=1, max_length=50)
    status: str = "REQUESTED"
    requested_at: datetime | None = None
    notes: str | None = None


class MaterialKitResponse(BaseModel):
    id: int
    production_order_id: int
    work_center_id: int
    kit_number: str
    status: str
    requested_at: datetime | None = None
    prepared_at: datetime | None = None
    staged_at: datetime | None = None
    notes: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

class MaterialKitItemCreate(BaseModel):
    kit_id: int
    material_id: int
    required_quantity: float = Field(gt=0)
    staged_quantity: float = Field(default=0, ge=0)
    status: str = "REQUIRED"


class MaterialKitItemResponse(BaseModel):
    id: int
    kit_id: int
    material_id: int
    required_quantity: float
    staged_quantity: float
    status: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    class Config:
        from_attributes = True

