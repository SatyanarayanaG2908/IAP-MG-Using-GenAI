// FILE PATH: backend/services/translationService.js

const { Translate } = require('@google-cloud/translate').v2;
// Alternative: Use googletrans python service or free translation API

/**
 * AUTOMATIC TRANSLATION SERVICE
 * 
 * Translates any text to target language in real-time
 * No need for predefined translations!
 */

class TranslationService {
    constructor() {
        // Option 1: Google Cloud Translation API (Paid, Best Quality)
        // this.translator = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

        // Option 2: Use Python translation service (Free, Good Quality)
        this.pythonServiceUrl = process.env.TRANSLATION_SERVICE_URL || 'http://localhost:5002';
    }

    /**
     * Translate text to target language
     * @param {string} text - Text to translate
     * @param {string} targetLang - Target language code (hi, te, ta, etc.)
     * @returns {Promise<string>} Translated text
     */
    async translate(text, targetLang) {
        if (!text) return '';

        // If English, return as-is
        if (targetLang === 'en' || targetLang === 'English') {
            return text;
        }

        try {
            // Map language names to codes
            const langCodeMap = {
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
            };

            const targetCode = langCodeMap[targetLang] || targetLang;

            // Call Python translation service
            const axios = require('axios');
            const response = await axios.post(`${this.pythonServiceUrl}/translate`, {
                text,
                target_lang: targetCode,
            }, { timeout: 10000 });

            return response.data.translated_text || text;

        } catch (error) {
            console.error('Translation error:', error.message);
            // Fallback: return original text
            return text;
        }
    }

    /**
     * Translate entire diagnosis result
     * @param {Object} diagnosisData - Complete diagnosis object
     * @param {string} targetLang - Target language
     * @returns {Promise<Object>} Translated diagnosis
     */
    async translateDiagnosis(diagnosisData, targetLang) {
        if (targetLang === 'en' || targetLang === 'English') {
            return diagnosisData;
        }

        try {
            const translated = { ...diagnosisData };

            // Translate disease names and reasoning
            if (translated.diseases) {
                translated.diseases = await Promise.all(
                    translated.diseases.map(async (disease) => ({
                        ...disease,
                        name: await this.translate(disease.name, targetLang),
                        reasoning: Array.isArray(disease.reasoning)
                            ? await Promise.all(
                                disease.reasoning.map(r => this.translate(r, targetLang))
                            )
                            : await this.translate(disease.reasoning, targetLang),
                    }))
                );
            }

            // Translate treatment
            if (translated.treatment?.medicines) {
                translated.treatment.medicines = await Promise.all(
                    translated.treatment.medicines.map(async (med) => ({
                        ...med,
                        name: await this.translate(med.name, targetLang),
                        purpose: await this.translate(med.purpose, targetLang),
                        timing: await this.translate(med.timing, targetLang),
                    }))
                );
            }

            // Translate diet
            if (translated.diet) {
                if (translated.diet.recommended) {
                    translated.diet.recommended = await Promise.all(
                        translated.diet.recommended.map(item => this.translate(item, targetLang))
                    );
                }
                if (translated.diet.avoid) {
                    translated.diet.avoid = await Promise.all(
                        translated.diet.avoid.map(item => this.translate(item, targetLang))
                    );
                }
            }

            // Translate precautions
            if (translated.precautions) {
                translated.precautions = await Promise.all(
                    translated.precautions.map(p => this.translate(p, targetLang))
                );
            }

            // Translate recovery
            if (translated.recovery) {
                translated.recovery.duration = await this.translate(
                    translated.recovery.duration, targetLang
                );
                translated.recovery.timeline = await this.translate(
                    translated.recovery.timeline, targetLang
                );
            }

            return translated;

        } catch (error) {
            console.error('Diagnosis translation error:', error.message);
            return diagnosisData; // Fallback: return original
        }
    }
}

module.exports = new TranslationService();