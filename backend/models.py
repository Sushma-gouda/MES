from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
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