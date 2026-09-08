from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Customer, User
from schemas import CustomerResponse
from dependencies import get_current_user

router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)

@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    customers = db.query(Customer).filter(Customer.is_active == True).all()
    return customers
