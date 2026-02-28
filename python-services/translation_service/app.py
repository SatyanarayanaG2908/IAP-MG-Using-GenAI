# FILE PATH: python-services/translation_service/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator
import os

app = Flask(__name__)
CORS(app)

# Initialize translator
translator = Translator()

# Language code mapping
LANGUAGE_CODES = {
    'English': 'en',
    'Hindi': 'hi',
    'Telugu': 'te',
    'Tamil': 'ta',
    'Bengali': 'bn',
    'Marathi': 'mr',
    'Gujarati': 'gu',
    'Kannada': 'kn',
    'Malayalam': 'ml',
    'Punjabi': 'pa',
}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'success': True,
        'message': 'Translation Service is running',
        'service': 'translation',
        'version': '1.0',
        'supported_languages': list(LANGUAGE_CODES.keys())
    }), 200


@app.route('/translate', methods=['POST'])
def translate_text():
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'message': 'Missing required field: text'
            }), 400

        text = data['text']
        target_lang = data.get('target_lang', 'en')

        if not text or not text.strip():
            return jsonify({
                'success': True,
                'translated_text': '',
                'source_lang': 'en',
                'target_lang': target_lang
            })

        if target_lang in LANGUAGE_CODES:
            target_lang = LANGUAGE_CODES[target_lang]

        if target_lang == 'en':
            return jsonify({
                'success': True,
                'translated_text': text,
                'source_lang': 'en',
                'target_lang': 'en'
            })

        print(f"📝 Translating: '{text[:50]}...' to {target_lang}")
        result = translator.translate(text, dest=target_lang)
        print(f"✅ Translated: '{result.text[:50]}...'")

        return jsonify({
            'success': True,
            'translated_text': result.text,
            'source_lang': result.src,
            'target_lang': target_lang
        })

    except Exception as e:
        print(f"❌ Translation error: {str(e)}")
        # FIX: data might not exist if get_json() failed
        original_text = data.get('text', '') if data else ''
        return jsonify({
            'success': False,
            'message': f'Translation failed: {str(e)}',
            'translated_text': original_text
        }), 500


@app.route('/translate-batch', methods=['POST'])
def translate_batch():
    try:
        data = request.get_json()

        if not data or 'texts' not in data:
            return jsonify({
                'success': False,
                'message': 'Missing required field: texts (array)'
            }), 400

        texts = data['texts']
        target_lang = data.get('target_lang', 'en')

        if target_lang in LANGUAGE_CODES:
            target_lang = LANGUAGE_CODES[target_lang]

        if target_lang == 'en':
            return jsonify({
                'success': True,
                'translations': texts
            })

        translations = []
        for text in texts:
            if not text or not text.strip():
                translations.append('')
                continue
            result = translator.translate(text, dest=target_lang)
            translations.append(result.text)

        return jsonify({
            'success': True,
            'translations': translations,
            'target_lang': target_lang
        })

    except Exception as e:
        print(f"❌ Batch translation error: {str(e)}")
        original_texts = data.get('texts', []) if data else []
        return jsonify({
            'success': False,
            'message': f'Batch translation failed: {str(e)}',
            'translations': original_texts
        }), 500


@app.route('/detect-language', methods=['POST'])
def detect_language():
    try:
        data = request.get_json()

        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'message': 'Missing required field: text'
            }), 400

        text = data['text']
        detection = translator.detect(text)

        return jsonify({
            'success': True,
            'detected_lang': detection.lang,
            'confidence': detection.confidence
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Language detection failed: {str(e)}'
        }), 500


if __name__ == '__main__':
    # FIX: Changed default port from 5002 to 5003 (5002 is SMS service)
    port = int(os.getenv('FLASK_PORT', 5003))

    print(f"🚀 Translation Service starting on port {port}...")
    print(f"🌐 Supported languages: {len(LANGUAGE_CODES)}")
    print(f"✅ Ready to translate!")

    app.run(host='0.0.0.0', port=port, debug=False)