import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()


MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")


def send_otp_email(to_email: str, otp: str):
    message = EmailMessage()

    message["Subject"] = "MES - Email Verification OTP"
    message["From"] = MAIL_FROM
    message["To"] = to_email

    message.set_content(
        f"""
Hello,

Your OTP for MES account verification is:

{otp}

This OTP is valid for 10 minutes.

If you did not request this OTP, please ignore this email.

Regards,
MES Team
"""
    )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(MAIL_USERNAME, MAIL_PASSWORD)
        smtp.send_message(message)