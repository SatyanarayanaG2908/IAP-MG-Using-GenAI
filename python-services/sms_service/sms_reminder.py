# FILE PATH: python-services/sms_service/sms_reminder.py

import os
from dotenv import load_dotenv
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Initialize background scheduler
scheduler = BackgroundScheduler()
scheduler.start()

def send_sms(to_phone: str, message: str) -> tuple:
    """
    Send SMS using Twilio API
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER]):
            return False, "SMS service not configured. Add Twilio credentials to .env file."
        
        from twilio.rest import Client
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        message_obj = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone
        )
        
        return True, f"SMS sent successfully! SID: {message_obj.sid}"
        
    except Exception as e:
        return False, f"Failed to send SMS: {str(e)}"

def schedule_sms(to_phone: str, message: str, send_time: str) -> tuple:
    """
    Schedule SMS to be sent at specific time
    
    Args:
        to_phone: Phone number to send to
        message: SMS message content
        send_time: ISO format datetime string or datetime object
        
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        # Convert string to datetime if needed
        if isinstance(send_time, str):
            send_datetime = datetime.fromisoformat(send_time.replace('Z', '+00:00'))
        else:
            send_datetime = send_time
        
        # Don't schedule if time is in the past
        if send_datetime < datetime.now():
            return False, "Scheduled time is in the past"
        
        trigger = DateTrigger(run_date=send_datetime)
        job_id = f"sms_{to_phone}_{send_datetime.timestamp()}"
        
        scheduler.add_job(
            send_sms,
            trigger=trigger,
            args=[to_phone, message],
            id=job_id,
            replace_existing=True
        )
        
        return True, f"SMS scheduled for {send_datetime.strftime('%I:%M %p on %B %d, %Y')}"
        
    except Exception as e:
        return False, f"Failed to schedule SMS: {str(e)}"

def format_phone_number(phone: str) -> tuple:
    """
    Format and validate phone number
    
    Args:
        phone: Phone number string
        
    Returns:
        tuple: (is_valid: bool, formatted_phone: str)
    """
    # Remove all non-digit characters
    phone = ''.join(filter(str.isdigit, phone))
    
    if not phone:
        return False, ""
    
    # Add country code if not present (assuming India +91)
    if len(phone) == 10:
        phone = '91' + phone
    
    # Add + prefix if not present
    if not phone.startswith('+'):
        phone = '+' + phone
    
    # Validate length (should be 12-16 digits including country code)
    if len(phone) < 12 or len(phone) > 16:
        return False, phone
    
    return True, phone

def get_scheduler_jobs():
    """Get all scheduled jobs"""
    return scheduler.get_jobs()

def cancel_scheduled_sms(job_id: str) -> bool:
    """Cancel a scheduled SMS"""
    try:
        scheduler.remove_job(job_id)
        return True
    except:
        return False
