# FILE PATH: python-services/sms_service/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from twilio.rest import Client
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, date
import pytz
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

TWILIO_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE = os.getenv('TWILIO_PHONE_NUMBER')

# In-memory store of scheduled reminders
# { reminder_id: { phone, message, times: ["09:00","21:00"], start_date, end_date } }
scheduled_reminders = {}

scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Kolkata'))

def send_sms(phone, message):
    try:
        client = Client(TWILIO_SID, TWILIO_TOKEN)
        msg = client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=phone
        )
        logging.info(f"✅ SMS sent to {phone}: {msg.sid}")
        return True
    except Exception as e:
        logging.error(f"❌ SMS error: {str(e)}")
        return False

def check_and_send_reminders():
    """Called every minute by scheduler — sends SMS if time matches and within date range"""
    now = datetime.now(pytz.timezone('Asia/Kolkata'))
    current_time = now.strftime('%H:%M')
    current_date = now.date()

    for reminder_id, reminder in list(scheduled_reminders.items()):
        try:
            start = datetime.strptime(reminder['start_date'], '%Y-%m-%d').date() if reminder.get('start_date') else current_date
            end = datetime.strptime(reminder['end_date'], '%Y-%m-%d').date() if reminder.get('end_date') else current_date

            # Check date range
            if not (start <= current_date <= end):
                # Past end date — remove
                if current_date > end:
                    logging.info(f"Reminder {reminder_id} expired, removing")
                    del scheduled_reminders[reminder_id]
                continue

            # Check if current time matches any reminder time
            for t in reminder.get('times', []):
                if t == current_time:
                    success = send_sms(reminder['phone'], reminder['message'])
                    if success:
                        logging.info(f"✅ Sent reminder {reminder_id} at {current_time}")

        except Exception as e:
            logging.error(f"Error processing reminder {reminder_id}: {str(e)}")

# Run every minute
scheduler.add_job(check_and_send_reminders, 'interval', minutes=1)
scheduler.start()
logging.info("✅ SMS Scheduler started (runs every minute)")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'sms', 'active_reminders': len(scheduled_reminders)})

@app.route('/send-test-sms', methods=['POST'])
def send_test_sms():
    data = request.json
    phone = data.get('phone')
    language = data.get('language', 'English')

    if not phone:
        return jsonify({'success': False, 'message': 'Phone number required'}), 400

    message = f"✅ Test SMS from IAP-MG Using GenAI. Your SMS reminders are working correctly! - IAP-MG"
    success = send_sms(phone, message)

    if success:
        return jsonify({'success': True, 'message': 'Test SMS sent successfully'})
    else:
        return jsonify({'success': False, 'message': 'Failed to send test SMS. Check Twilio credentials.'}), 500

@app.route('/schedule-reminders', methods=['POST'])
def schedule_reminders():
    data = request.json
    reminders = data.get('reminders', [])

    scheduled_count = 0
    for r in reminders:
        rid = str(r.get('id', f"r_{datetime.now().timestamp()}"))
        scheduled_reminders[rid] = {
            'phone': r.get('phone'),
            'message': r.get('message'),
            'times': r.get('reminderTimes', ['09:00']),
            'start_date': r.get('startDate', date.today().strftime('%Y-%m-%d')),
            'end_date': r.get('endDate', date.today().strftime('%Y-%m-%d')),
            'type': r.get('type', 'medicine'),
            'language': r.get('language', 'English'),
        }
        scheduled_count += 1
        logging.info(f"📅 Scheduled reminder {rid}: {scheduled_reminders[rid]['times']} from {scheduled_reminders[rid]['start_date']} to {scheduled_reminders[rid]['end_date']}")

    return jsonify({
        'success': True,
        'message': f'{scheduled_count} reminder(s) scheduled',
        'total_active': len(scheduled_reminders)
    })

@app.route('/reminders', methods=['GET'])
def get_reminders():
    return jsonify({
        'success': True,
        'count': len(scheduled_reminders),
        'reminders': list(scheduled_reminders.keys())
    })

@app.route('/cancel-reminder/<reminder_id>', methods=['DELETE'])
def cancel_reminder(reminder_id):
    if reminder_id in scheduled_reminders:
        del scheduled_reminders[reminder_id]
        return jsonify({'success': True, 'message': 'Reminder cancelled'})
    return jsonify({'success': False, 'message': 'Reminder not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=False)