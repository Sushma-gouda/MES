from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pwdlib import PasswordHash

from database import get_db
from models import User, EmailOTP
from schemas import SignupRequest, LoginRequest, VerifyOTPRequest, TokenResponse
from email_service import send_otp_email
from auth_utils import create_access_token
from dependencies import get_current_user

from datetime import datetime, timedelta, timezone
import random


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

password_hash = PasswordHash.recommended()


@router.post("/signup")
def signup(
    user_data: SignupRequest,
    db: Session = Depends(get_db)
):
    # Remove unnecessary spaces from name and email
    name = user_data.name.strip()
    email = user_data.email.strip()

    # Check whether the email already exists
    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = password_hash.hash(user_data.password)

    # Create the user
    new_user = User(
        name=name,
        email=email,
        password_hash=hashed_password
    )

    # Save the user first
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate a random 6-digit OTP
    otp = str(random.randint(100000, 999999))

    # OTP will expire after 10 minutes
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Store OTP in database
    new_otp = EmailOTP(
        user_id=new_user.id,
        otp_code=otp,
        expires_at=expires_at
    )

    db.add(new_otp)
    db.commit()

    # Send OTP to user's email
    try:
        send_otp_email(email, otp)

    except Exception:
        # If email sending fails, remove the newly created user
        db.delete(new_otp)
        db.delete(new_user)
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to send verification email"
        )

    return {
        "message": "User created successfully. OTP sent to your email."
    }


@router.post("/verify-otp")
def verify_otp(
    otp_data: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    # Find the user
    user = db.query(User).filter(
        User.email == otp_data.email.strip()
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check whether the user is already verified
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified"
        )

    # Find the latest OTP for this user
    otp_record = db.query(EmailOTP).filter(
        EmailOTP.user_id == user.id
    ).order_by(
        EmailOTP.created_at.desc()
    ).first()

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP not found"
        )

    # Check whether OTP has expired
    if datetime.now(timezone.utc) > otp_record.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )

    # Check whether OTP is correct
    if otp_record.otp_code != otp_data.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    # Mark user as verified
    user.is_verified = True
    db.commit()

    return {
        "message": "Email verified successfully"
    }


@router.post("/login", response_model=TokenResponse)
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):
    # Find the user by email
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    # Check whether user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check password
    password_is_correct = password_hash.verify(
        user_data.password,
        user.password_hash
    )

    if not password_is_correct:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check whether email is verified
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in"
        )

    # Create JWT access token
    access_token = create_access_token(
        user_id=user.id,
        email=user.email
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_verified": current_user.is_verified
    }