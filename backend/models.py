from sqlalchemy import Column, Integer, Numeric, String, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


# =========================================================
# AUTHENTICATION MODELS
# =========================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class EmailOTP(Base):
    __tablename__ = "email_otps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    otp_code = Column(String(6), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# =========================================================
# MES MODULE 1 — ORDER RELEASE
# =========================================================

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    customer_code = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    customer_name = Column(
        String(150),
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationship with ProductionOrder
    production_orders = relationship(
        "ProductionOrder",
        back_populates="customer"
    )


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    product_code = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    product_name = Column(
        String(150),
        nullable=False
    )

    revision = Column(
        String(20),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationship with ProductionOrder
    production_orders = relationship(
        "ProductionOrder",
        back_populates="product"
    )


class ProductionOrder(Base):
    __tablename__ = "production_orders"

    # -----------------------------------------------------
    # Identification
    # -----------------------------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_number = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    erp_order_number = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    # -----------------------------------------------------
    # Relationships
    # -----------------------------------------------------

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False,
        index=True
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False,
        index=True
    )

    # -----------------------------------------------------
    # Quantity
    # -----------------------------------------------------

    quantity = Column(
        Integer,
        nullable=False
    )

    produced_quantity = Column(
        Integer,
        default=0,
        nullable=False
    )

    # -----------------------------------------------------
    # Order priority and status
    # -----------------------------------------------------

    priority = Column(
        String(20),
        nullable=False,
        default="MEDIUM"
    )

    status = Column(
        String(30),
        nullable=False,
        default="RECEIVED"
    )

    # -----------------------------------------------------
    # Dates
    # -----------------------------------------------------

    due_date = Column(
        DateTime(timezone=True),
        nullable=False
    )

    planned_start = Column(
        DateTime(timezone=True),
        nullable=True
    )

    planned_end = Column(
        DateTime(timezone=True),
        nullable=True
    )

    actual_start = Column(
        DateTime(timezone=True),
        nullable=True
    )

    actual_end = Column(
        DateTime(timezone=True),
        nullable=True
    )

    # -----------------------------------------------------
    # BOM and Routing
    # -----------------------------------------------------

    bom_revision = Column(
        String(20),
        nullable=False
    )

    routing_revision = Column(
        String(20),
        nullable=False
    )

    # -----------------------------------------------------
    # Release information
    # -----------------------------------------------------

    released_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    released_by = Column(
        String(100),
        nullable=True
    )

    hold_reason = Column(
        Text,
        nullable=True
    )

    # -----------------------------------------------------
    # Audit timestamps
    # -----------------------------------------------------

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # -----------------------------------------------------
    # Relationships
    # -----------------------------------------------------

    customer = relationship(
        "Customer",
        back_populates="production_orders"
    )

    product = relationship(
        "Product",
        back_populates="production_orders"
    )

#Module 2

class WorkCenter(Base):
    __tablename__ = "work_centers"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    line = Column(String(100), nullable=False)
    capacity_hours = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


class ProductionSchedule(Base):
    __tablename__ = "production_schedules"

    id = Column(Integer, primary_key=True, index=True)

    production_order_id = Column(
        Integer,
        ForeignKey("production_orders.id"),
        nullable=False,
        index=True,
    )

    work_center_id = Column(
        Integer,
        ForeignKey("work_centers.id"),
        nullable=False,
        index=True,
    )

    sequence_number = Column(
        Integer,
        nullable=False,
    )

    planned_start = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    planned_end = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    status = Column(
        String(30),
        nullable=False,
        default="PLANNED",
    )

    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    production_order = relationship(
        "ProductionOrder",
        backref="schedules",
    )

    work_center = relationship(
        "WorkCenter",
    )

# module 3 
class MachineCapacity(Base):
    __tablename__ = "machine_capacities"

    id = Column(Integer, primary_key=True, index=True)
    work_center_id = Column(
        Integer,
        ForeignKey("work_centers.id"),
        nullable=False,
        index=True,
    )
    available_date = Column(Date, nullable=False)
    available_hours = Column(Numeric(10, 2), nullable=False)
    used_hours = Column(Numeric(10, 2), default=0, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    work_center = relationship("WorkCenter")

class LaborAvailability(Base):
    __tablename__ = "labor_availability"

    id = Column(Integer, primary_key=True, index=True)
    work_center_id = Column(
        Integer,
        ForeignKey("work_centers.id"),
        nullable=False,
        index=True,
    )
    available_date = Column(Date, nullable=False)
    available_hours = Column(Numeric(10, 2), nullable=False)
    used_hours = Column(Numeric(10, 2), default=0, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    work_center = relationship("WorkCenter")

class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    tool_code = Column(String(50), unique=True, nullable=False, index=True)
    tool_name = Column(String(100), nullable=False)
    quantity_available = Column(Integer, nullable=False)
    quantity_in_use = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

class CapacityRequirement(Base):
    __tablename__ = "capacity_requirements"

    id = Column(Integer, primary_key=True, index=True)

    production_schedule_id = Column(
        Integer,
        ForeignKey("production_schedules.id"),
        nullable=False,
        index=True,
    )

    required_machine_hours = Column(Numeric(10, 2), nullable=False)
    required_labor_hours = Column(Numeric(10, 2), nullable=False)

    required_tool_id = Column(
        Integer,
        ForeignKey("tools.id"),
        nullable=True,
        index=True,
    )
    required_tool_quantity = Column(Integer, default=0, nullable=False)

    required_start = Column(DateTime(timezone=True), nullable=False)
    required_end = Column(DateTime(timezone=True), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    production_schedule = relationship("ProductionSchedule")
    required_tool = relationship("Tool")

class FeasibilityCheck(Base):
    __tablename__ = "feasibility_checks"

    id = Column(Integer, primary_key=True, index=True)

    production_schedule_id = Column(
        Integer,
        ForeignKey("production_schedules.id"),
        nullable=False,
        index=True,
    )

    machine_feasible = Column(Boolean, nullable=False)
    labor_feasible = Column(Boolean, nullable=False)
    tool_feasible = Column(Boolean, nullable=False)
    date_feasible = Column(Boolean, nullable=False)

    overall_feasible = Column(Boolean, nullable=False)

    required_machine_hours = Column(Numeric(10, 2), nullable=False)
    available_machine_hours = Column(Numeric(10, 2), nullable=False)

    reason = Column(Text, nullable=True)

    checked_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    checked_by = Column(String(100), nullable=True)

    production_schedule = relationship("ProductionSchedule")


# =========================================================
# MES MODULE 4 — DISPATCH
# =========================================================

class MESDispatchQueue(Base):
    __tablename__ = "mes_dispatch_queue"

    id = Column(Integer, primary_key=True, index=True)

    production_schedule_id = Column(
        Integer,
        ForeignKey("production_schedules.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    production_order_id = Column(
        Integer,
        ForeignKey("production_orders.id"),
        nullable=False,
        index=True,
    )

    status = Column(String(50), nullable=False, default="DISPATCHED")

    dispatched_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    
    dispatched_by = Column(String(100), nullable=False)

    production_schedule = relationship("ProductionSchedule")
    production_order = relationship("ProductionOrder")

#module 5
class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    material_code = Column(String(50), unique=True, nullable=False, index=True)
    material_name = Column(String(150), nullable=False)
    unit = Column(String(20), nullable=False)

    available_quantity = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    reserved_quantity = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

class MaterialRequirement(Base):
    __tablename__ = "material_requirements"

    id = Column(Integer, primary_key=True, index=True)

    production_order_id = Column(
        Integer,
        ForeignKey("production_orders.id"),
        nullable=False,
        index=True
    )

    material_id = Column(
        Integer,
        ForeignKey("materials.id"),
        nullable=False,
        index=True
    )

    required_quantity = Column(
        Numeric(12, 2),
        nullable=False
    )

    issued_quantity = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    status = Column(
        String(30),
        nullable=False,
        default="REQUIRED"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    production_order = relationship(
        "ProductionOrder",
        backref="material_requirements"
    )

    material = relationship(
        "Material",
        backref="requirements"
    )

class MaterialKit(Base):
    __tablename__ = "material_kits"

    id = Column(Integer, primary_key=True, index=True)

    production_order_id = Column(
        Integer,
        ForeignKey("production_orders.id"),
        nullable=False,
        index=True
    )

    work_center_id = Column(
        Integer,
        ForeignKey("work_centers.id"),
        nullable=False,
        index=True
    )

    kit_number = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    status = Column(
        String(30),
        nullable=False,
        default="REQUESTED"
    )

    requested_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    prepared_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    staged_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    notes = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    production_order = relationship(
        "ProductionOrder",
        backref="material_kits"
    )

    work_center = relationship(
        "WorkCenter",
        backref="material_kits"
    )

    items = relationship(
        "MaterialKitItem",
        back_populates="kit",
        cascade="all, delete-orphan"
    )

class MaterialKitItem(Base):
    __tablename__ = "material_kit_items"

    id = Column(Integer, primary_key=True, index=True)

    kit_id = Column(
        Integer,
        ForeignKey("material_kits.id"),
        nullable=False,
        index=True
    )

    material_id = Column(
        Integer,
        ForeignKey("materials.id"),
        nullable=False,
        index=True
    )

    required_quantity = Column(
        Numeric(12, 2),
        nullable=False
    )

    staged_quantity = Column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    status = Column(
        String(30),
        nullable=False,
        default="REQUIRED"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    kit = relationship(
        "MaterialKit",
        back_populates="items"
    )

    material = relationship(
        "Material",
        backref="kit_items"
    )

