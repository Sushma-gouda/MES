from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Customer, Product, ProductionOrder, User
from schemas import (
    ProductionOrderCreate,
    ProductionOrderResponse,
    ProductionOrderDetailResponse,
    ProductionOrderListResponse,
    HoldOrderRequest,
)
from dependencies import get_current_user


router = APIRouter(
    prefix="/production-orders",
    tags=["Production Orders"],
)


# =========================================================
# CREATE / RECEIVE PRODUCTION ORDER
# =========================================================

@router.post(
    "/",
    response_model=ProductionOrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_production_order(
    order_data: ProductionOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check whether the order number already exists
    existing_order = (
        db.query(ProductionOrder)
        .filter(ProductionOrder.order_number == order_data.order_number)
        .first()
    )

    if existing_order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order number already exists",
        )

    # Check whether the ERP order number already exists
    existing_erp_order = (
        db.query(ProductionOrder)
        .filter(
            ProductionOrder.erp_order_number
            == order_data.erp_order_number
        )
        .first()
    )

    if existing_erp_order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ERP order number already exists",
        )

    # Check customer
    customer = (
        db.query(Customer)
        .filter(Customer.id == order_data.customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    if not customer.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer is inactive",
        )

    # Check product
    product = (
        db.query(Product)
        .filter(Product.id == order_data.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    if not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product is inactive",
        )

    # Create the production order
    new_order = ProductionOrder(
        order_number=order_data.order_number,
        erp_order_number=order_data.erp_order_number,
        customer_id=order_data.customer_id,
        product_id=order_data.product_id,
        quantity=order_data.quantity,
        produced_quantity=0,
        priority=order_data.priority.upper(),
        status="RECEIVED",
        due_date=order_data.due_date,
        bom_revision=order_data.bom_revision,
        routing_revision=order_data.routing_revision,
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return {
        "id": new_order.id,
        "order_number": new_order.order_number,
        "erp_order_number": new_order.erp_order_number,
        "customer_id": new_order.customer_id,
        "product_id": new_order.product_id,
        "quantity": new_order.quantity,
        "produced_quantity": new_order.produced_quantity,
        "remaining_quantity": (
            new_order.quantity - new_order.produced_quantity
        ),
        "priority": new_order.priority,
        "status": new_order.status,
        "due_date": new_order.due_date,
        "bom_revision": new_order.bom_revision,
        "routing_revision": new_order.routing_revision,
        "planned_start": new_order.planned_start,
        "planned_end": new_order.planned_end,
        "actual_start": new_order.actual_start,
        "actual_end": new_order.actual_end,
        "released_at": new_order.released_at,
        "released_by": new_order.released_by,
        "hold_reason": new_order.hold_reason,
        "created_at": new_order.created_at,
        "updated_at": new_order.updated_at,
    }


# =========================================================
# GET ALL PRODUCTION ORDERS
# =========================================================

@router.get(
    "/",
    response_model=list[ProductionOrderListResponse],
)
def get_production_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    orders = (
        db.query(ProductionOrder)
        .join(Customer)
        .join(Product)
        .order_by(ProductionOrder.created_at.desc())
        .all()
    )

    result = []

    for order in orders:
        result.append(
            {
                "id": order.id,
                "order_number": order.order_number,
                "erp_order_number": order.erp_order_number,
                "customer_name": order.customer.customer_name,
                "product_code": order.product.product_code,
                "product_name": order.product.product_name,
                "quantity": order.quantity,
                "produced_quantity": order.produced_quantity,
                "remaining_quantity": (
                    order.quantity - order.produced_quantity
                ),
                "priority": order.priority,
                "status": order.status,
                "due_date": order.due_date,
                "bom_revision": order.bom_revision,
                "routing_revision": order.routing_revision,
            }
        )

    return result


# =========================================================
# GET ONE PRODUCTION ORDER
# =========================================================

@router.get(
    "/{order_id}",
    response_model=ProductionOrderDetailResponse,
)
def get_production_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = (
        db.query(ProductionOrder)
        .filter(ProductionOrder.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production order not found",
        )

    return {
        "id": order.id,
        "order_number": order.order_number,
        "erp_order_number": order.erp_order_number,
        "customer_id": order.customer_id,
        "product_id": order.product_id,
        "quantity": order.quantity,
        "produced_quantity": order.produced_quantity,
        "remaining_quantity": (
            order.quantity - order.produced_quantity
        ),
        "priority": order.priority,
        "status": order.status,
        "due_date": order.due_date,
        "bom_revision": order.bom_revision,
        "routing_revision": order.routing_revision,
        "planned_start": order.planned_start,
        "planned_end": order.planned_end,
        "actual_start": order.actual_start,
        "actual_end": order.actual_end,
        "released_at": order.released_at,
        "released_by": order.released_by,
        "hold_reason": order.hold_reason,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
        "customer_name": order.customer.customer_name,
        "customer_code": order.customer.customer_code,
        "product_name": order.product.product_name,
        "product_code": order.product.product_code,
        "product_revision": order.product.revision,
    }


# =========================================================
# VALIDATE PRODUCTION ORDER
# =========================================================

@router.post(
    "/{order_id}/validate",
    response_model=ProductionOrderResponse,
)
def validate_production_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = (
        db.query(ProductionOrder)
        .filter(ProductionOrder.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production order not found",
        )

    # Order should not be validated again after release
    if order.status == "RELEASED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order is already released",
        )

    if order.status == "CANCELLED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cancelled orders cannot be validated",
        )

    # Validate customer
    customer = (
        db.query(Customer)
        .filter(Customer.id == order.customer_id)
        .first()
    )

    if not customer or not customer.is_active:
        order.status = "ON_HOLD"
        order.hold_reason = "Customer is missing or inactive"
        db.commit()
        db.refresh(order)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order validation failed: customer is missing or inactive",
        )

    # Validate product
    product = (
        db.query(Product)
        .filter(Product.id == order.product_id)
        .first()
    )

    if not product or not product.is_active:
        order.status = "ON_HOLD"
        order.hold_reason = "Product is missing or inactive"
        db.commit()
        db.refresh(order)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order validation failed: product is missing or inactive",
        )

    # Validate quantity
    if order.quantity <= 0:
        order.status = "ON_HOLD"
        order.hold_reason = "Production quantity must be greater than zero"
        db.commit()
        db.refresh(order)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order validation failed: invalid quantity",
        )

    # Validate BOM revision
    if not order.bom_revision.strip():
        order.status = "ON_HOLD"
        order.hold_reason = "BOM revision is missing"
        db.commit()
        db.refresh(order)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order validation failed: BOM revision is missing",
        )

    # Validate routing revision
    if not order.routing_revision.strip():
        order.status = "ON_HOLD"
        order.hold_reason = "Routing revision is missing"
        db.commit()
        db.refresh(order)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order validation failed: routing revision is missing",
        )

    # Validation successful
    order.status = "READY"
    order.hold_reason = None

    db.commit()
    db.refresh(order)

    return {
        "id": order.id,
        "order_number": order.order_number,
        "erp_order_number": order.erp_order_number,
        "customer_id": order.customer_id,
        "product_id": order.product_id,
        "quantity": order.quantity,
        "produced_quantity": order.produced_quantity,
        "remaining_quantity": (
            order.quantity - order.produced_quantity
        ),
        "priority": order.priority,
        "status": order.status,
        "due_date": order.due_date,
        "bom_revision": order.bom_revision,
        "routing_revision": order.routing_revision,
        "planned_start": order.planned_start,
        "planned_end": order.planned_end,
        "actual_start": order.actual_start,
        "actual_end": order.actual_end,
        "released_at": order.released_at,
        "released_by": order.released_by,
        "hold_reason": order.hold_reason,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
    }


# =========================================================
# RELEASE PRODUCTION ORDER
# =========================================================

@router.post(
    "/{order_id}/release",
    response_model=ProductionOrderResponse,
)
def release_production_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = (
        db.query(ProductionOrder)
        .filter(ProductionOrder.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production order not found",
        )

    if order.status != "READY":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only READY orders can be released",
        )

    order.status = "RELEASED"
    order.released_at = datetime.now(timezone.utc)
    order.released_by = current_user.name
    order.hold_reason = None

    db.commit()
    db.refresh(order)

    return {
        "id": order.id,
        "order_number": order.order_number,
        "erp_order_number": order.erp_order_number,
        "customer_id": order.customer_id,
        "product_id": order.product_id,
        "quantity": order.quantity,
        "produced_quantity": order.produced_quantity,
        "remaining_quantity": (
            order.quantity - order.produced_quantity
        ),
        "priority": order.priority,
        "status": order.status,
        "due_date": order.due_date,
        "bom_revision": order.bom_revision,
        "routing_revision": order.routing_revision,
        "planned_start": order.planned_start,
        "planned_end": order.planned_end,
        "actual_start": order.actual_start,
        "actual_end": order.actual_end,
        "released_at": order.released_at,
        "released_by": order.released_by,
        "hold_reason": order.hold_reason,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
    }


# =========================================================
# HOLD PRODUCTION ORDER
# =========================================================

@router.post(
    "/{order_id}/hold",
    response_model=ProductionOrderResponse,
)
def hold_production_order(
    order_id: int,
    hold_data: HoldOrderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = (
        db.query(ProductionOrder)
        .filter(ProductionOrder.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Production order not found",
        )

    if order.status in ["CANCELLED", "COMPLETED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This order cannot be put on hold",
        )

    order.status = "ON_HOLD"
    order.hold_reason = hold_data.hold_reason.strip()

    db.commit()
    db.refresh(order)

    return {
        "id": order.id,
        "order_number": order.order_number,
        "erp_order_number": order.erp_order_number,
        "customer_id": order.customer_id,
        "product_id": order.product_id,
        "quantity": order.quantity,
        "produced_quantity": order.produced_quantity,
        "remaining_quantity": (
            order.quantity - order.produced_quantity
        ),
        "priority": order.priority,
        "status": order.status,
        "due_date": order.due_date,
        "bom_revision": order.bom_revision,
        "routing_revision": order.routing_revision,
        "planned_start": order.planned_start,
        "planned_end": order.planned_end,
        "actual_start": order.actual_start,
        "actual_end": order.actual_end,
        "released_at": order.released_at,
        "released_by": order.released_by,
        "hold_reason": order.hold_reason,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
    }