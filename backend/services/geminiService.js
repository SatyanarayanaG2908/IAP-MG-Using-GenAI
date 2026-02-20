// FILE PATH: backend/services/geminiService.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 8192 }
    });
    console.log('✅ Gemini AI initialized successfully');
  } catch (error) {
    console.error('❌ Gemini AI initialization failed:', error.message);
  }
} else {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
}

exports.isAvailable = () => genAI !== null && model !== null;

// Language-specific instruction map — tells Gemini exactly what to do
const LANGUAGE_INSTRUCTIONS = {
  'English': 'Respond ENTIRELY in English. All fields, values, names, descriptions must be in English.',
  'Telugu': 'అన్ని fields, disease names, medicines, diet, precautions, reasoning — అన్నీ తెలుగు లో రాయి. ఒక్క English word కూడా వాడకు JSON keys తప్ప.',
  'Hindi': 'सभी fields, disease names, medicines, diet, precautions, reasoning — सब कुछ हिन्दी में लिखो। JSON keys छोड़कर एक भी English word मत लिखो।',
  'Tamil': 'அனைத்து fields, disease names, medicines, diet, precautions, reasoning — அனைத்தும் தமிழில் எழுதவும். JSON keys தவிர ஒரு English வார்த்தையும் பயன்படுத்தாதீர்கள்.',
  'Kannada': 'ಎಲ್ಲಾ fields, disease names, medicines, diet, precautions, reasoning — ಎಲ್ಲವನ್ನೂ ಕನ್ನಡದಲ್ಲಿ ಬರೆಯಿರಿ. JSON keys ಹೊರತು ಒಂದೇ ಒಂದು English ಪದ ಬಳಸಬೇಡಿ.',
  'Malayalam': 'എല്ലാ fields, disease names, medicines, diet, precautions, reasoning — എല്ലാം മലയാളത്തിൽ എഴുതുക. JSON keys ഒഴികെ ഒരു English വാക്കും ഉപയോഗിക്കരുത്.',
  'Marathi': 'सर्व fields, disease names, medicines, diet, precautions, reasoning — सर्व काही मराठीत लिहा. JSON keys सोडून एकही English शब्द वापरू नका.',
  'Bengali': 'সমস্ত fields, disease names, medicines, diet, precautions, reasoning — সবকিছু বাংলায় লিখুন। JSON keys ছাড়া একটিও English শব্দ ব্যবহার করবেন না।',
  'Gujarati': 'બધા fields, disease names, medicines, diet, precautions, reasoning — બધું ગુજરાતીમાં લખો. JSON keys સિવાય એક પણ English શબ્દ વાપરો નહીં.',
  'Punjabi': 'ਸਾਰੇ fields, disease names, medicines, diet, precautions, reasoning — ਸਭ ਕੁਝ ਪੰਜਾਬੀ ਵਿੱਚ ਲਿਖੋ। JSON keys ਤੋਂ ਇਲਾਵਾ ਇੱਕ ਵੀ English ਸ਼ਬਦ ਨਾ ਵਰਤੋ।',
};

exports.generateCompleteDiagnosis = async (symptoms, userData) => {
  if (!exports.isAvailable()) {
    throw new Error('Gemini AI is not configured. Please add GEMINI_API_KEY to .env file');
  }

  try {
    const { age, gender, medicalConditions, language } = userData;
    const selectedLanguage = language || 'English';
    const langInstruction = LANGUAGE_INSTRUCTIONS[selectedLanguage] || LANGUAGE_INSTRUCTIONS['English'];

    const prompt = `You are an expert medical AI assistant. Analyze the patient's symptoms and provide a comprehensive diagnosis.

⚠️ LANGUAGE REQUIREMENT — THIS IS MANDATORY:
${langInstruction}
The output language is: ${selectedLanguage}
Every single text value in the JSON (disease names, reasoning, medicine names, diet items, precautions, recovery text, emergency messages) MUST be written in ${selectedLanguage}.
Only the JSON structural keys (like "diseases", "name", "confidence", "reasoning", "treatment", etc.) stay in English.
Do NOT mix languages. Do NOT use English for any content values.

PATIENT INFORMATION:
- Age: ${age || 'Not specified'} years
- Gender: ${gender || 'Not specified'}
- Pre-existing Medical Conditions: ${medicalConditions?.length > 0 ? medicalConditions.join(', ') : 'None'}
- Symptoms: ${symptoms}

CRITICAL INSTRUCTIONS:
1. Check if symptoms indicate a medical EMERGENCY (chest pain, difficulty breathing, severe bleeding, loss of consciousness, stroke signs, severe allergic reaction)
2. If emergency detected, set "emergency": true and describe emergency symptoms in ${selectedLanguage}
3. Provide top 3 most likely diagnoses with confidence scores (totaling ~100%)
4. Give practical treatment advice — OTC medicines only, no prescriptions
5. Recommend diet changes
6. List important precautions
7. Estimate recovery timeline
8. ALL TEXT VALUES must be in ${selectedLanguage} — no exceptions

Return ONLY valid JSON (no markdown, no backticks, no extra text outside JSON):

{
  "emergency": false,
  "emergencySymptoms": [],
  "emergencyMessage": "",
  "diseases": [
    {
      "name": "Disease name in ${selectedLanguage}",
      "confidence": 65,
      "reasoning": ["Reason 1 in ${selectedLanguage}", "Reason 2 in ${selectedLanguage}"]
    },
    {
      "name": "Disease name 2 in ${selectedLanguage}",
      "confidence": 25,
      "reasoning": ["Reason 1 in ${selectedLanguage}"]
    },
    {
      "name": "Disease name 3 in ${selectedLanguage}",
      "confidence": 10,
      "reasoning": ["Reason 1 in ${selectedLanguage}"]
    }
  ],
  "treatment": {
    "medicines": [
      {
        "name": "Medicine name in ${selectedLanguage}",
        "dosage": "Dosage in ${selectedLanguage}",
        "frequency": "Frequency in ${selectedLanguage}",
        "duration": "Duration in ${selectedLanguage}",
        "timing": "Timing in ${selectedLanguage}",
        "sideEffects": "Side effects in ${selectedLanguage}",
        "foodInstruction": "Food instruction in ${selectedLanguage}"
      }
    ],
    "homeRemedies": ["Home remedy 1 in ${selectedLanguage}", "Home remedy 2 in ${selectedLanguage}"]
  },
  "diet": {
    "recommended": ["Food 1 in ${selectedLanguage}", "Food 2 in ${selectedLanguage}"],
    "avoid": ["Avoid 1 in ${selectedLanguage}", "Avoid 2 in ${selectedLanguage}"]
  },
  "precautions": ["Precaution 1 in ${selectedLanguage}", "Precaution 2 in ${selectedLanguage}"],
  "recovery": {
    "duration": "Duration in ${selectedLanguage}",
    "timeline": "Timeline description in ${selectedLanguage}",
    "followUp": "Follow-up advice in ${selectedLanguage}",
    "confidence": "High/Medium/Low equivalent in ${selectedLanguage}"
  }
}

SAFETY RULES:
- Only suggest over-the-counter (OTC) medications
- Always recommend seeing a doctor for serious symptoms
- If emergency suspected, mark it as emergency
- Remember: ALL text values MUST be in ${selectedLanguage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up any markdown formatting Gemini might add
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Sometimes Gemini adds text before/after JSON — extract just the JSON
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.slice(jsonStart, jsonEnd + 1);
    }

    let diagnosis;
    try {
      diagnosis = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError.message);
      console.error('Raw AI Response (first 500 chars):', text.slice(0, 500));
      throw new Error('AI returned invalid format. Please try again.');
    }

    if (!diagnosis.diseases || !Array.isArray(diagnosis.diseases) || diagnosis.diseases.length === 0) {
      throw new Error('Invalid diagnosis format received from AI. Please try again.');
    }

    console.log(`✅ Diagnosis generated in ${selectedLanguage} — ${diagnosis.diseases.length} conditions found`);
    return diagnosis;

  } catch (error) {
    console.error('Gemini AI Error:', error.message);
    if (error.message.includes('API key')) throw new Error('Gemini API key is invalid. Please check your .env configuration.');
    if (error.message.includes('404') || error.message.includes('not found')) throw new Error('Gemini model not available. Please contact support.');
    throw new Error(`AI diagnosis failed: ${error.message}`);
  }
};

exports.testConnection = async () => {
  if (!exports.isAvailable()) return { success: false, message: 'Gemini AI not initialized' };
  try {
    const result = await model.generateContent('Hello, respond with just "OK"');
    const response = await result.response;
    return { success: true, message: 'Gemini AI is working', response: response.text() };
  } catch (error) {
    return { success: false, message: error.message };
  }
};