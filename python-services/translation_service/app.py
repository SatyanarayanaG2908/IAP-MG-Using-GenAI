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
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Translation Service is running',
        'service': 'translation',
        'version': '1.0',
        'supported_languages': list(LANGUAGE_CODES.keys())
    }), 200


@app.route('/translate', methods=['POST'])
def translate_text():
    """
    Translate text to target language
    
    Expected JSON:
    {
        "text": "Hello, how are you?",
        "target_lang": "hi"  // or "Hindi"
    }
    
    Returns:
    {
        "success": true,
        "translated_text": "नमस्ते, आप कैसे हैं?",
        "source_lang": "en",
        "target_lang": "hi"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'message': 'Missing required field: text'
            }), 400
        
        text = data['text']
        target_lang = data.get('target_lang', 'en')
        
        # If empty text, return empty
        if not text or not text.strip():
            return jsonify({
                'success': True,
                'translated_text': '',
                'source_lang': 'en',
                'target_lang': target_lang
            })
        
        # Convert language name to code if needed
        if target_lang in LANGUAGE_CODES:
            target_lang = LANGUAGE_CODES[target_lang]
        
        # If target is English, return as-is
        if target_lang == 'en':
            return jsonify({
                'success': True,
                'translated_text': text,
                'source_lang': 'en',
                'target_lang': 'en'
            })
        
        # Translate
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
        return jsonify({
            'success': False,
            'message': f'Translation failed: {str(e)}',
            'translated_text': data.get('text', '')  # Fallback: return original
        }), 500


@app.route('/translate-batch', methods=['POST'])
def translate_batch():
    """
    Translate multiple texts at once
    
    Expected JSON:
    {
        "texts": ["Hello", "How are you?", "Good morning"],
        "target_lang": "hi"
    }
    
    Returns:
    {
        "success": true,
        "translations": ["नमस्ते", "आप कैसे हैं?", "सुप्रभात"]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data:
            return jsonify({
                'success': False,
                'message': 'Missing required field: texts (array)'
            }), 400
        
        texts = data['texts']
        target_lang = data.get('target_lang', 'en')
        
        # Convert language name to code
        if target_lang in LANGUAGE_CODES:
            target_lang = LANGUAGE_CODES[target_lang]
        
        # If target is English, return as-is
        if target_lang == 'en':
            return jsonify({
                'success': True,
                'translations': texts
            })
        
        # Translate all texts
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
        return jsonify({
            'success': False,
            'message': f'Batch translation failed: {str(e)}',
            'translations': data.get('texts', [])  # Fallback
        }), 500


@app.route('/detect-language', methods=['POST'])
def detect_language():
    """
    Detect language of given text
    
    Expected JSON:
    {
        "text": "नमस्ते"
    }
    
    Returns:
    {
        "success": true,
        "detected_lang": "hi",
        "confidence": 0.99
    }
    """
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
    port = int(os.getenv('FLASK_PORT', 5002))
    
    print(f"🚀 Translation Service starting on port {port}...")
    print(f"🌐 Supported languages: {len(LANGUAGE_CODES)}")
    print(f"✅ Ready to translate!")
    
    app.run(host='0.0.0.0', port=port, debug=False)