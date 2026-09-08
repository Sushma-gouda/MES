from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Product, User
from schemas import ProductResponse
from dependencies import get_current_user

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)

@router.get("/", response_model=list[ProductResponse])
def get_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    products = db.query(Product).filter(Product.is_active == True).all()
    return products
