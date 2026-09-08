from datetime import datetime

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