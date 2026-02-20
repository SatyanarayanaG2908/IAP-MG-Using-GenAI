# FILE PATH: python-services/translation_service/translator.py

"""
Optimized Auto Translation System with:
- Lazy initialization
- Caching for performance
- Fast translation with minimal overhead
"""

from googletrans import Translator

class AutoTranslator:
    def __init__(self):
        self.translator = Translator()
        self.cache = {}
        
        # Language code mapping
        self.lang_codes = {
            "English": "en",
            "Hindi": "hi",
            "Telugu": "te",
            "Tamil": "ta",
            "Bengali": "bn",
            "Marathi": "mr",
            "Gujarati": "gu",
            "Kannada": "kn",
            "Malayalam": "ml",
            "Punjabi": "pa"
        }
    
    def translate(self, text: str, target_language: str = "English") -> str:
        """
        Fast auto-translate with caching
        
        Args:
            text: Text to translate
            target_language: Target language name
            
        Returns:
            Translated text
        """
        if not text or not text.strip():
            return text
            
        # If already in English, return as-is
        if target_language == "English":
            return text
        
        # Check cache first
        cache_key = f"{text}_{target_language}"
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        try:
            # Get language code
            dest_lang = self.lang_codes.get(target_language, "en")
            
            # Translate
            result = self.translator.translate(text, dest=dest_lang, src='en')
            translated_text = result.text
            
            # Save to cache
            self.cache[cache_key] = translated_text
            
            return translated_text
            
        except Exception as e:
            print(f"Translation error for '{text}': {e}")
            return text  # Return original if translation fails
    
    def translate_list(self, text_list: list, target_language: str = "English") -> list:
        """
        Translate a list of texts
        
        Args:
            text_list: List of texts to translate
            target_language: Target language name
            
        Returns:
            List of translated texts
        """
        return [self.translate(text, target_language) for text in text_list]
    
    def clear_cache(self):
        """Clear translation cache"""
        self.cache = {}

# Convenience function for quick translations
def t(text: str, language: str = 'English') -> str:
    """
    Quick translation function
    
    Args:
        text: Text to translate
        language: Target language
        
    Returns:
        Translated text
    """
    translator = AutoTranslator()
    return translator.translate(text, language)
