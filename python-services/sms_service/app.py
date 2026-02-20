# FILE PATH: python-services/sms_service/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sms_service.sms_reminder import send_sms, format_phone_number, schedule_sms

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'SMS Service is running',
        'service': 'sms_reminders',
        'twilio_configured': all([
            os.getenv('TWILIO_ACCOUNT_SID'),
            os.getenv('TWILIO_AUTH_TOKEN'),
            os.getenv('TWILIO_PHONE_NUMBER')
        ])
    }), 200

@app.route('/send-test-sms', methods=['POST'])
def send_test_sms_endpoint():
    """
    Send test SMS
    
    Expected JSON:
    {
        "phone": "9876543210",
        "language": "English"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'phone' not in data:
            return jsonify({
                'success': False,
                'message': 'Phone number is required'
            }), 400
        
        phone = data.get('phone')
        language = data.get('language', 'English')
        
        # Format phone number
        is_valid, formatted_phone = format_phone_number(phone)
        
        if not is_valid:
            return jsonify({
                'success': False,
                'message': 'Invalid phone number format'
            }), 400
        
        # Test message based on language
        messages = {
            'English': 'This is a test SMS from IAP-MG Using GenAI. Your SMS service is working successfully!',
            'Hindi': 'यह IAP-MG Using GenAI से एक परीक्षण SMS है। आपकी SMS सेवा सफलतापूर्वक काम कर रही है!',
            'Telugu': 'ఇది IAP-MG Using GenAI నుండి ఒక పరీక్ష SMS. మీ SMS సేవ విజయవంతంగా పని చేస్తోంది!',
            'Tamil': 'இது IAP-MG Using GenAI இருந்து ஒரு சோதனை SMS. உங்கள் SMS சேவை வெற்றிகரமாக செயல்படுகிறது!',
        }
        
        message = messages.get(language, messages['English'])
        
        # Send SMS
        success, result_message = send_sms(formatted_phone, message)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Test SMS sent successfully',
                'phone': formatted_phone,
                'details': result_message
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result_message
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error sending test SMS: {str(e)}'
        }), 500

@app.route('/schedule-reminders', methods=['POST'])
def schedule_reminders_endpoint():
    """
    Schedule SMS reminders
    
    Expected JSON:
    {
        "reminders": [
            {
                "id": "reminder_id",
                "phone": "9876543210",
                "message": "Medicine reminder message",
                "type": "medicine",
                "scheduled_for": "2024-03-20T09:00:00",
                "language": "English"
            }
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'reminders' not in data:
            return jsonify({
                'success': False,
                'message': 'Reminders array is required'
            }), 400
        
        reminders = data.get('reminders', [])
        
        if not reminders or len(reminders) == 0:
            return jsonify({
                'success': False,
                'message': 'No reminders provided'
            }), 400
        
        scheduled_count = 0
        failed_count = 0
        results = []
        
        for reminder in reminders:
            try:
                phone = reminder.get('phone')
                message = reminder.get('message')
                scheduled_for = reminder.get('scheduled_for')
                reminder_id = reminder.get('id')
                
                # Format phone
                is_valid, formatted_phone = format_phone_number(phone)
                
                if not is_valid:
                    failed_count += 1
                    results.append({
                        'id': reminder_id,
                        'success': False,
                        'message': 'Invalid phone number'
                    })
                    continue
                
                # Schedule SMS
                success, result_msg = schedule_sms(
                    formatted_phone,
                    message,
                    scheduled_for
                )
                
                if success:
                    scheduled_count += 1
                    results.append({
                        'id': reminder_id,
                        'success': True,
                        'message': 'Scheduled successfully'
                    })
                else:
                    failed_count += 1
                    results.append({
                        'id': reminder_id,
                        'success': False,
                        'message': result_msg
                    })
                    
            except Exception as e:
                failed_count += 1
                results.append({
                    'id': reminder.get('id', 'unknown'),
                    'success': False,
                    'message': str(e)
                })
        
        return jsonify({
            'success': scheduled_count > 0,
            'message': f'Scheduled {scheduled_count} reminders, {failed_count} failed',
            'scheduled': scheduled_count,
            'failed': failed_count,
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error scheduling reminders: {str(e)}'
        }), 500

@app.route('/send-immediate', methods=['POST'])
def send_immediate_sms():
    """
    Send immediate SMS (no scheduling)
    
    Expected JSON:
    {
        "phone": "9876543210",
        "message": "Your custom message",
        "language": "English"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'phone' not in data or 'message' not in data:
            return jsonify({
                'success': False,
                'message': 'Phone and message are required'
            }), 400
        
        phone = data.get('phone')
        message = data.get('message')
        
        # Format phone
        is_valid, formatted_phone = format_phone_number(phone)
        
        if not is_valid:
            return jsonify({
                'success': False,
                'message': 'Invalid phone number format'
            }), 400
        
        # Send SMS
        success, result_message = send_sms(formatted_phone, message)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'SMS sent successfully',
                'phone': formatted_phone
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result_message
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error sending SMS: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5002))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 SMS Service starting on port {port}...")
    print(f"📱 Twilio configured: {all([os.getenv('TWILIO_ACCOUNT_SID'), os.getenv('TWILIO_AUTH_TOKEN')])}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
