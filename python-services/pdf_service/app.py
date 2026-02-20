# FILE PATH: python-services/pdf_service/app.py

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pdf_service.pdf_generator import generate_pdf_report

load_dotenv()
app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'success': True, 'message': 'PDF Service is running', 'version': '2.0'}), 200

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400

        user_data = data.get('user_data') or {}
        symptoms = data.get('symptoms') or 'Not specified'
        analysis_result = data.get('analysis_result') or {}
        language = data.get('language', 'English')

        # Fill missing user_data fields with defaults - no more 400 errors
        user_data.setdefault('username', user_data.get('email', 'user').split('@')[0])
        user_data.setdefault('first_name', user_data.get('username', 'Patient'))
        user_data.setdefault('last_name', '')
        user_data.setdefault('email', 'N/A')
        user_data.setdefault('age', 'N/A')
        user_data.setdefault('gender', 'N/A')
        user_data.setdefault('blood_group', 'N/A')
        user_data.setdefault('phone', 'N/A')

        # Check diseases exist
        diseases = analysis_result.get('diseases', [])
        if not diseases:
            return jsonify({'success': False, 'message': 'No diagnosis data found in analysis_result'}), 400

        print(f"📄 Generating PDF for: {user_data.get('username')} | Language: {language} | Diseases: {len(diseases)}")

        pdf_path = generate_pdf_report(
            user_data=user_data,
            symptoms=symptoms,
            analysis_result=analysis_result,
            language=language
        )

        if not pdf_path or not os.path.exists(pdf_path):
            return jsonify({'success': False, 'message': 'PDF generation failed - file not created'}), 500

        print(f"✅ PDF ready: {pdf_path}")
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"medical_report_{user_data.get('username','patient')}_{language}.pdf"
        )

    except Exception as e:
        print(f"❌ PDF generation error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'message': f'PDF generation error: {str(e)}'}), 500

@app.route('/test', methods=['GET'])
def test_pdf():
    """Quick test endpoint"""
    try:
        user_data = {
            'username': 'test_user', 'first_name': 'Test', 'last_name': 'User',
            'email': 'test@example.com', 'phone': '9876543210',
            'age': 25, 'gender': 'Male', 'blood_group': 'O+'
        }
        symptoms = "fever, headache, body pain"
        analysis_result = {
            'diseases': [
                {'name': 'Influenza', 'confidence': 75, 'reason': 'High fever and body pain indicate flu'},
                {'name': 'Common Cold', 'confidence': 20, 'reason': 'Mild overlap with cold symptoms'},
            ],
            'final_disease': 'Influenza',
            'medical_plan': {
                'medicines': [{'name': 'Paracetamol 650mg', 'dosage': '1 tablet', 'frequency': '3 times daily', 'duration': '3-5 days', 'foodInstruction': 'After food'}],
                'diet': {'recommended': ['Warm soups', 'Fluids'], 'avoid': ['Cold drinks']},
                'precautions': ['Rest', 'Drink water']
            },
            'recovery': {'duration': '5-7 days', 'timeline': 'Improve in 3-5 days'}
        }
        pdf_path = generate_pdf_report(user_data, symptoms, analysis_result, 'English')
        return send_file(pdf_path, mimetype='application/pdf', as_attachment=True, download_name='test_report.pdf')
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    print(f"🚀 PDF Service starting on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)