from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import (
    Material,
    MaterialRequirement,
    MaterialKit,
    MaterialKitItem,
    ProductionOrder,
    WorkCenter,
)
from schemas import (
    MaterialCreate,
    MaterialResponse,
    MaterialRequirementCreate,
    MaterialRequirementResponse,
    MaterialKitCreate,
    MaterialKitResponse,
    MaterialKitItemCreate,
    MaterialKitItemResponse,
)


router = APIRouter(
    prefix="/staging-kitting",
    tags=["Staging & Kitting"]
)


# ============================================================
# MATERIALS
# ============================================================

@router.get(
    "/materials",
    response_model=list[MaterialResponse]
)
def get_materials(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return (
        db.query(Material)
        .order_by(Material.id)
        .all()
    )


@router.post(
    "/materials",
    response_model=MaterialResponse,
    status_code=201
)
def create_material(
    data: MaterialCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    existing = (
        db.query(Material)
        .filter(Material.material_code == data.material_code)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Material code already exists"
        )

    if data.reserved_quantity > data.available_quantity:
        raise HTTPException(
            status_code=400,
            detail="Reserved quantity cannot exceed available quantity"
        )

    material = Material(
        material_code=data.material_code,
        material_name=data.material_name,
        unit=data.unit,
        available_quantity=data.available_quantity,
        reserved_quantity=data.reserved_quantity,
        is_active=data.is_active,
    )

    db.add(material)
    db.commit()
    db.refresh(material)

    return material


# ============================================================
# MATERIAL REQUIREMENTS
# ============================================================

@router.get(
    "/requirements",
    response_model=list[MaterialRequirementResponse]
)
def get_material_requirements(
    production_order_id: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(MaterialRequirement)

    if production_order_id is not None:
        query = query.filter(
            MaterialRequirement.production_order_id
            == production_order_id
        )

    return query.order_by(MaterialRequirement.id).all()


@router.post(
    "/requirements",
    response_model=MaterialRequirementResponse,
    status_code=201
)
def create_material_requirement(
    data: MaterialRequirementCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Check production order
    production_order = (
        db.query(ProductionOrder)
        .filter(ProductionOrder.id == data.production_order_id)
        .first()
    )

    if not production_order:
        raise HTTPException(
            status_code=404,
            detail="Production order not found"
        )

    # Check material
    material = (
        db.query(Material)
        .filter(Material.id == data.material_id)
        .first()
    )

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    if not material.is_active:
        raise HTTPException(
            status_code=400,
            detail="Material is inactive"
        )

    if data.issued_quantity > data.required_quantity:
        raise HTTPException(
            status_code=400,
            detail="Issued quantity cannot exceed required quantity"
        )

    requirement = MaterialRequirement(
        production_order_id=data.production_order_id,
        material_id=data.material_id,
        required_quantity=data.required_quantity,
        issued_quantity=data.issued_quantity,
        status=data.status,
    )

    db.add(requirement)
    db.commit()
    db.refresh(requirement)

    return requirement


# ============================================================
# MATERIAL KITS
# ============================================================

@router.get(
    "/kits",
    response_model=list[MaterialKitResponse]
)
def get_kits(
    production_order_id: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(MaterialKit)

    if production_order_id is not None:
        query = query.filter(
            MaterialKit.production_order_id
            == production_order_id
        )

    return query.order_by(MaterialKit.id).all()


@router.get(
    "/kits/{kit_id}",
    response_model=MaterialKitResponse
)
def get_kit(
    kit_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    kit = (
        db.query(MaterialKit)
        .filter(MaterialKit.id == kit_id)
        .first()
    )

    if not kit:
        raise HTTPException(
            status_code=404,
            detail="Material kit not found"
        )

    return kit


@router.post(
    "/kits",
    response_model=MaterialKitResponse,
    status_code=201
)
def create_kit(
    data: MaterialKitCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Check production order
    production_order = (
        db.query(ProductionOrder)
        .filter(ProductionOrder.id == data.production_order_id)
        .first()
    )

    if not production_order:
        raise HTTPException(
            status_code=404,
            detail="Production order not found"
        )

    # Check work center
    work_center = (
        db.query(WorkCenter)
        .filter(WorkCenter.id == data.work_center_id)
        .first()
    )

    if not work_center:
        raise HTTPException(
            status_code=404,
            detail="Work center not found"
        )

    if not work_center.is_active:
        raise HTTPException(
            status_code=400,
            detail="Work center is inactive"
        )

    # Check duplicate kit number
    existing = (
        db.query(MaterialKit)
        .filter(MaterialKit.kit_number == data.kit_number)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Kit number already exists"
        )

    kit = MaterialKit(
        production_order_id=data.production_order_id,
        work_center_id=data.work_center_id,
        kit_number=data.kit_number,
        status=data.status,
        requested_at=data.requested_at or datetime.now(timezone.utc),
        notes=data.notes,
    )

    db.add(kit)
    db.commit()
    db.refresh(kit)

    return kit


# ============================================================
# KIT ITEMS
# ============================================================

@router.get(
    "/kit-items",
    response_model=list[MaterialKitItemResponse]
)
def get_kit_items(
    kit_id: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(MaterialKitItem)

    if kit_id is not None:
        query = query.filter(
            MaterialKitItem.kit_id == kit_id
        )

    return query.order_by(MaterialKitItem.id).all()


@router.post(
    "/kit-items",
    response_model=MaterialKitItemResponse,
    status_code=201
)
def create_kit_item(
    data: MaterialKitItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Check kit
    kit = (
        db.query(MaterialKit)
        .filter(MaterialKit.id == data.kit_id)
        .first()
    )

    if not kit:
        raise HTTPException(
            status_code=404,
            detail="Material kit not found"
        )

    if kit.status in ["KIT_PREPARED", "STAGED"]:
        raise HTTPException(
            status_code=400,
            detail="Cannot add items after the kit is prepared or staged"
        )

    # Check material
    material = (
        db.query(Material)
        .filter(Material.id == data.material_id)
        .first()
    )

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    if not material.is_active:
        raise HTTPException(
            status_code=400,
            detail="Material is inactive"
        )

    if data.staged_quantity > data.required_quantity:
        raise HTTPException(
            status_code=400,
            detail="Staged quantity cannot exceed required quantity"
        )

    item = MaterialKitItem(
        kit_id=data.kit_id,
        material_id=data.material_id,
        required_quantity=data.required_quantity,
        staged_quantity=data.staged_quantity,
        status=data.status,
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


# ============================================================
# RESERVE MATERIALS FOR A KIT
# ============================================================

@router.post(
    "/kits/{kit_id}/reserve",
    response_model=MaterialKitResponse
)
def reserve_materials(
    kit_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    kit = (
        db.query(MaterialKit)
        .filter(MaterialKit.id == kit_id)
        .first()
    )

    if not kit:
        raise HTTPException(
            status_code=404,
            detail="Material kit not found"
        )

    if kit.status != "REQUESTED":
        raise HTTPException(
            status_code=400,
            detail="Only REQUESTED kits can reserve materials"
        )

    items = (
        db.query(MaterialKitItem)
        .filter(MaterialKitItem.kit_id == kit_id)
        .all()
    )

    if not items:
        raise HTTPException(
            status_code=400,
            detail="Kit has no material items"
        )

    # Check availability first
    for item in items:
        material = (
            db.query(Material)
            .filter(Material.id == item.material_id)
            .first()
        )

        if not material:
            raise HTTPException(
                status_code=404,
                detail=f"Material {item.material_id} not found"
            )

        available = (
            material.available_quantity
            - material.reserved_quantity
        )

        if available < item.required_quantity:
            kit.status = "SHORTAGE"
            db.commit()

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Insufficient material: "
                    f"{material.material_code}. "
                    f"Required: {item.required_quantity}, "
                    f"Available: {available}"
                )
            )

    # Reserve materials
    for item in items:
        material = (
            db.query(Material)
            .filter(Material.id == item.material_id)
            .first()
        )

        material.reserved_quantity += item.required_quantity
        item.status = "RESERVED"

    kit.status = "MATERIALS_RESERVED"

    db.commit()
    db.refresh(kit)

    return kit


# ============================================================
# PREPARE KIT
# ============================================================

@router.post(
    "/kits/{kit_id}/prepare",
    response_model=MaterialKitResponse
)
def prepare_kit(
    kit_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    kit = (
        db.query(MaterialKit)
        .filter(MaterialKit.id == kit_id)
        .first()
    )

    if not kit:
        raise HTTPException(
            status_code=404,
            detail="Material kit not found"
        )

    if kit.status != "MATERIALS_RESERVED":
        raise HTTPException(
            status_code=400,
            detail="Materials must be reserved before preparing the kit"
        )

    items = (
        db.query(MaterialKitItem)
        .filter(MaterialKitItem.kit_id == kit_id)
        .all()
    )

    for item in items:
        item.staged_quantity = item.required_quantity
        item.status = "STAGED"

    kit.status = "KIT_PREPARED"
    kit.prepared_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(kit)

    return kit


# ============================================================
# STAGE KIT AT WORK CENTER
# ============================================================

@router.post(
    "/kits/{kit_id}/stage",
    response_model=MaterialKitResponse
)
def stage_kit(
    kit_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    kit = (
        db.query(MaterialKit)
        .filter(MaterialKit.id == kit_id)
        .first()
    )

    if not kit:
        raise HTTPException(
            status_code=404,
            detail="Material kit not found"
        )

    if kit.status != "KIT_PREPARED":
        raise HTTPException(
            status_code=400,
            detail="Kit must be prepared before staging"
        )

    items = (
        db.query(MaterialKitItem)
        .filter(MaterialKitItem.kit_id == kit_id)
        .all()
    )

    if not items:
        raise HTTPException(
            status_code=400,
            detail="Kit has no material items"
        )

    for item in items:
        if item.staged_quantity < item.required_quantity:
            raise HTTPException(
                status_code=400,
                detail="Cannot stage an incomplete kit"
            )

    kit.status = "STAGED"
    kit.staged_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(kit)

    return kit