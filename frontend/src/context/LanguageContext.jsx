// FILE PATH: frontend/src/context/LanguageContext.jsx

import React, { createContext, useState, useContext } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const commonKeys = {
    title: "IAP-MG Using GenAI", welcomeBack: "Welcome Back", createAccount: "Create Your Account",
    fullName: "Full Name", email: "Email", phone: "Phone Number", password: "Password",
    confirmPassword: "Confirm Password", age: "Age", dob: "Date of Birth", gender: "Gender",
    preferredLanguage: "Preferred Language", bloodGroup: "Blood Group", medicalConditions: "Existing Medical Conditions",
    register: "Register", login: "Login", logout: "Logout", otp: "OTP", resetPassword: "Reset Password",
    forgotPassword: "Forgot Password?", welcomeBackUser: "Welcome back, {name}", startNewDiagnosis: "Start New Diagnosis",
    totalSessions: "Total Sessions", completed: "Completed", language: "Language",
    recentSessions: "Recent Diagnosis Sessions", historyDesc: "Your health assessment history",
    noSessions: "No diagnosis sessions yet", startFirst: "Start your first health assessment to see it here",
    deleteConfirm: "Delete Diagnosis?", areYouSureDelete: "Are you sure you want to delete this session?",
    permanentAction: "This action cannot be undone. All data will be permanently deleted.",
    settings: "Settings", changeLanguage: "Change Language", confirmLanguageChange: "Confirm Language Change",
    languageChangeCheck: "Are you sure you want to change the application language to",
    cancel: "Cancel", confirm: "Confirm", delete: "Delete", view: "View",
    readyToStart: "Ready to start a new health assessment today?",
    syncingHealthData: "Syncing Health Data...", analysisPending: "Analysis Pending",
    noSymptomsRecorded: "No symptoms recorded", sessionDeletedSuccessfully: "Session deleted successfully",
    sessionRemoved: "Session removed", languageUpdated: "Language updated to {lang}",
    failedToUpdateLanguage: "Failed to update language", somethingWentWrong: "Something went wrong",
    pending: "Pending", emergency: "Emergency", analyzing: "Analyzing",
    aiMedicalDiagnosis: "AI Medical Diagnosis", instantHealthAssessment: "Instant health assessment powered by Google Gemini AI",
    symptoms: "Symptoms", aiAnalysis: "AI Analysis", backToDashboard: "Back to Dashboard",
    diagnosisResults: "Diagnosis Results", sessionFrom: "Session from {date}", possibleConditions: "Possible Conditions",
    downloadPDF: "Download PDF", emailReport: "Email Report", smsReminders: "SMS Reminders",
    medicalDisclaimer: "Medical Disclaimer", disclaimerText: "This is an AI-powered guidance system for educational purposes only. It is NOT a replacement for professional medical advice. Always consult a qualified healthcare provider.",
    generating: "Generating...", sending: "Sending...", reportSentTo: "Report sent to {email}!",
    downloadedSuccessfully: "PDF downloaded successfully!", sessionNotFound: "Session Not Found",
    unableToLoadSession: "Unable to load diagnosis session", tellUsWhatYouFeel: "Tell Us What You're Feeling",
    describeSymptomsDetail: "Describe your symptoms in detail. Our AI will analyze and provide instant medical guidance.",
    describeSymptoms: "Describe your symptoms *",
    symptomsPlaceholder: "Example: I have been experiencing a persistent headache for 3 days, along with mild fever and body aches...",
    pleaseDescribeSymptoms: "Please describe your symptoms",
    moreDetailsRequired: "Please provide more details (at least 10 characters)",
    howLongSymptoms: "How long have you had these symptoms?", selectDuration: "Select duration",
    howSevere: "How severe are your symptoms?", selectSeverity: "Select severity",
    tipTitle: "Tip:", symptomTip: "Be as specific as possible. Mention when symptoms started, any triggers, patterns, or related symptoms you've noticed.",
    quickExamples: "Quick examples:", getAiDiagnosis: "Get AI Diagnosis",
    analyzingSymptoms: "Analyzing your symptoms...", aiAnalyzingSymptoms: "AI is analyzing your symptoms...",
    analysisFailed: "Analysis Failed", tryAgain: "Try Again", noDiagnosisAvailable: "No Diagnosis Available",
    startOver: "Start Over", yourAiDiagnosisResults: "Your AI Diagnosis Results",
    analysisPoweredBy: "Analysis powered by Google Gemini AI",
    dur_less24h: "Less than 24 hours", dur_1_3d: "1-3 days", dur_3_7d: "3-7 days",
    dur_1_2w: "1-2 weeks", dur_more2w: "More than 2 weeks",
    sev_mild: "Mild", sev_moderate: "Moderate", sev_severe: "Severe",
    ex_fever: "Fever, headache, body aches", ex_cough: "Cough, sore throat, runny nose",
    ex_stomach: "Stomach pain, nausea, vomiting", ex_chest: "Chest pain, difficulty breathing",
    confidenceBreakdown: "Confidence Breakdown", scheduling: "Scheduling...",
    scheduleReminders: "Schedule Reminders", phoneError: "Please enter phone number",
    medicineError: "Please enter medicine name", dateError: "Please select follow-up date",
    typeError: "Please select reminder type",
    mostLikely: "Most Likely", confidence: "Confidence",
    clickForBreakdown: "Click confidence for breakdown",
    show: "Show", hide: "Hide", clinicalReasoning: "Clinical Reasoning",
    symptomMatch: "Symptom Match", severityAlignment: "Severity Alignment",
    durationCorrelation: "Duration Correlation",
    symptomMatchDesc: "How well your symptoms align with this condition",
    severityAlignmentDesc: "Symptom severity matches typical presentation",
    durationCorrelationDesc: "Timeline fits disease progression",
    clinicalReasoningDesc: "AI analysis of medical patterns",
    howWeCalculated: "How We Calculated This Score",
    overallScore: "Overall Confidence Score",
    closeBreakdown: "Close Breakdown",
};

const translations = {
    English: { ...commonKeys },

    Telugu: {
        ...commonKeys,
        title: "IAP-MG జెనరేటివ్ AI ఉపయోగించి", welcomeBack: "తిరిగి స్వాగతం",
        createAccount: "మీ ఖాతాను సృష్టించండి", fullName: "పూర్తి పేరు", email: "ఇమెయిల్",
        phone: "ఫోన్ నంబర్", password: "పాస్‌వర్డ్", confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
        register: "నమోదు చేయండి", login: "లాగిన్", logout: "లాగ్ అవుట్",
        welcomeBackUser: "తిరిగి స్వాగతం, {name}", startNewDiagnosis: "కొత్త రోగనిర్ధారణ ప్రారంభించండి",
        totalSessions: "మొత్తం సెషన్లు", completed: "పూర్తయింది", language: "భాష",
        recentSessions: "ఇటీవలి రోగనిర్ధారణ సెషన్లు", noSessions: "ఇంకా రోగనిర్ధారణ సెషన్లు లేవు",
        settings: "సెట్టింగులు", changeLanguage: "భాష మార్చండి",
        cancel: "రద్దు చేయండి", confirm: "నిర్ధారించండి", delete: "తొలగించు",
        readyToStart: "ఈరోజు కొత్త ఆరోగ్య అంచనా ప్రారంభించాలా?",
        aiMedicalDiagnosis: "AI వైద్య రోగనిర్ధారణ",
        tellUsWhatYouFeel: "మీకు ఎలా అనిపిస్తుందో చెప్పండి",
        describeSymptomsDetail: "మీ లక్షణాలను వివరంగా వివరించండి. మా AI విశ్లేషించి తక్షణ వైద్య మార్గదర్శకత్వం అందిస్తుంది.",
        describeSymptoms: "మీ లక్షణాలు వివరించండి *",
        getAiDiagnosis: "AI రోగనిర్ధారణ పొందండి",
        analyzingSymptoms: "మీ లక్షణాలు విశ్లేషిస్తోంది...",
        downloadPDF: "PDF డౌన్‌లోడ్ చేయండి", emailReport: "ఇమెయిల్ నివేదిక",
        smsReminders: "SMS రిమైండర్లు", medicalDisclaimer: "వైద్య నిరాకరణ",
        mostLikely: "అత్యంత సంభావ్యత", confidence: "నమ్మకం",
        show: "చూపించు", hide: "దాచు", clinicalReasoning: "క్లినికల్ రీజనింగ్",
        symptomMatch: "లక్షణాల సరిపోలిక", severityAlignment: "తీవ్రత అమరిక",
        durationCorrelation: "వ్యవధి సహసంబంధం", howWeCalculated: "ఈ స్కోర్‌ను ఎలా లెక్కించాం",
        dur_less24h: "24 గంటల కంటే తక్కువ", dur_1_3d: "1-3 రోజులు", dur_3_7d: "3-7 రోజులు",
        sev_mild: "తేలికపాటి", sev_moderate: "మితమైన", sev_severe: "తీవ్రమైన",
        ex_fever: "జ్వరం, తలనొప్పి, ఒంటి నొప్పులు", ex_cough: "దగ్గు, గొంతు నొప్పి",
        ex_stomach: "కడుపు నొప్పి, వికారం", ex_chest: "ఛాతీ నొప్పి, శ్వాస ఇబ్బంది",
    },

    Hindi: {
        ...commonKeys,
        title: "IAP-MG GenAI का उपयोग करके", welcomeBack: "वापस स्वागत है",
        fullName: "पूरा नाम", email: "ईमेल", phone: "फोन नंबर", password: "पासवर्ड",
        register: "पंजीकरण करें", login: "लॉगिन", logout: "लॉगआउट",
        welcomeBackUser: "वापस स्वागत है, {name}", startNewDiagnosis: "नया निदान शुरू करें",
        totalSessions: "कुल सत्र", completed: "पूर्ण", language: "भाषा",
        settings: "सेटिंग्स", changeLanguage: "भाषा बदलें",
        cancel: "रद्द करें", confirm: "पुष्टि करें", delete: "हटाएं",
        aiMedicalDiagnosis: "AI चिकित्सा निदान",
        tellUsWhatYouFeel: "बताइए आप कैसा महसूस कर रहे हैं",
        describeSymptomsDetail: "अपने लक्षणों का विस्तार से वर्णन करें।",
        getAiDiagnosis: "AI निदान प्राप्त करें",
        analyzingSymptoms: "आपके लक्षणों का विश्लेषण...",
        downloadPDF: "PDF डाउनलोड करें", emailReport: "ईमेल रिपोर्ट",
        smsReminders: "SMS रिमाइंडर",
        mostLikely: "सबसे संभावित", confidence: "विश्वास",
        show: "दिखाएं", hide: "छुपाएं", clinicalReasoning: "क्लिनिकल तर्क",
        symptomMatch: "लक्षण मिलान", severityAlignment: "गंभीरता संरेखण",
        howWeCalculated: "हमने यह स्कोर कैसे गणना किया",
        dur_less24h: "24 घंटे से कम", dur_1_3d: "1-3 दिन", sev_mild: "हल्का", sev_severe: "गंभीर",
        ex_fever: "बुखार, सिरदर्द, शरीर दर्द", ex_cough: "खांसी, गले में दर्द",
    },

    Tamil: {
        ...commonKeys,
        title: "IAP-MG GenAI பயன்படுத்தி", welcomeBack: "மீண்டும் வரவேற்கிறோம்",
        fullName: "முழு பெயர்", login: "உள்நுழை", logout: "வெளியேறு",
        welcomeBackUser: "மீண்டும் வரவேற்கிறோம், {name}", startNewDiagnosis: "புதிய நோய் கண்டறிதல் தொடங்கு",
        settings: "அமைப்புகள்", changeLanguage: "மொழி மாற்றவும்",
        cancel: "ரத்து செய்", confirm: "உறுதிப்படுத்து",
        aiMedicalDiagnosis: "AI மருத்துவ நோய் கண்டறிதல்",
        tellUsWhatYouFeel: "நீங்கள் எப்படி உணர்கிறீர்கள் என்று சொல்லுங்கள்",
        getAiDiagnosis: "AI நோய் கண்டறிதல் பெறுங்கள்",
        downloadPDF: "PDF பதிவிறக்கவும்", emailReport: "மின்னஞ்சல் அறிக்கை",
        mostLikely: "மிகவும் சாத்தியம்", confidence: "நம்பகத்தன்மை",
        show: "காட்டு", hide: "மறை",
        ex_fever: "காய்ச்சல், தலைவலி, உடல் வலி", ex_cough: "இருமல், தொண்டை வலி",
    },

    Kannada: {
        ...commonKeys,
        title: "IAP-MG GenAI ಬಳಸಿ", welcomeBack: "ಮತ್ತೆ ಸ್ವಾಗತ",
        login: "ಲಾಗಿನ್", logout: "ಲಾಗ್ ಔಟ್",
        welcomeBackUser: "ಮತ್ತೆ ಸ್ವಾಗತ, {name}", startNewDiagnosis: "ಹೊಸ ರೋಗನಿರ್ಣಯ ಪ್ರಾರಂಭಿಸಿ",
        settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", changeLanguage: "ಭಾಷೆ ಬದಲಾಯಿಸಿ",
        cancel: "ರದ್ದು ಮಾಡಿ", confirm: "ದೃಢೀಕರಿಸಿ",
        aiMedicalDiagnosis: "AI ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ",
        tellUsWhatYouFeel: "ನೀವು ಹೇಗೆ ಅನುಭವಿಸುತ್ತಿದ್ದೀರಿ ಎಂದು ಹೇಳಿ",
        getAiDiagnosis: "AI ರೋಗನಿರ್ಣಯ ಪಡೆಯಿರಿ",
        downloadPDF: "PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
        mostLikely: "ಹೆಚ್ಚು ಸಾಧ್ಯ", confidence: "ವಿಶ್ವಾಸ",
        ex_fever: "ಜ್ವರ, ತಲೆನೋವು, ದೇಹ ನೋವು", ex_cough: "ಕೆಮ್ಮು, ಗಂಟಲು ನೋವು",
    },

    Malayalam: {
        ...commonKeys,
        title: "IAP-MG GenAI ഉപയോഗിച്ച്", welcomeBack: "തിരിച്ചു സ്വാഗതം",
        login: "ലോഗിൻ", logout: "ലോഗൗട്ട്",
        welcomeBackUser: "തിരിച്ചു സ്വാഗതം, {name}", startNewDiagnosis: "പുതിയ രോഗനിർണ്ണയം ആരംഭിക്കുക",
        settings: "ക്രമീകരണങ്ങൾ", changeLanguage: "ഭാഷ മാറ്റുക",
        cancel: "റദ്ദാക്കുക", confirm: "സ്ഥിരീകരിക്കുക",
        aiMedicalDiagnosis: "AI വൈദ്യ രോഗനിർണ്ണയം",
        getAiDiagnosis: "AI രോഗനിർണ്ണയം നേടുക",
        downloadPDF: "PDF ഡൗൺലോഡ്",
        mostLikely: "ഏറ്റവും സാദ്ധ്യത", confidence: "ആത്മവിശ്വാസം",
        ex_fever: "പനി, തലവേദന, ശരീരവേദന", ex_cough: "ചുമ, തൊണ്ടവേദന",
    },

    Marathi: {
        ...commonKeys,
        title: "IAP-MG GenAI वापरून", welcomeBack: "परत स्वागत आहे",
        login: "लॉगिन", logout: "लॉगआउट",
        welcomeBackUser: "परत स्वागत आहे, {name}", startNewDiagnosis: "नवीन निदान सुरू करा",
        settings: "सेटिंग्ज", changeLanguage: "भाषा बदला",
        cancel: "रद्द करा", confirm: "पुष्टी करा",
        aiMedicalDiagnosis: "AI वैद्यकीय निदान",
        getAiDiagnosis: "AI निदान मिळवा",
        downloadPDF: "PDF डाउनलोड करा",
        mostLikely: "सर्वात शक्यता", confidence: "विश्वास",
        ex_fever: "ताप, डोकेदुखी, अंगदुखी", ex_cough: "खोकला, घसादुखी",
    },

    Bengali: {
        ...commonKeys,
        title: "IAP-MG GenAI ব্যবহার করে", welcomeBack: "ফিরে আসতে স্বাগতম",
        login: "লগইন", logout: "লগআউট",
        welcomeBackUser: "ফিরে আসতে স্বাগতম, {name}", startNewDiagnosis: "নতুন রোগ নির্ণয় শুরু করুন",
        settings: "সেটিংস", changeLanguage: "ভাষা পরিবর্তন করুন",
        cancel: "বাতিল করুন", confirm: "নিশ্চিত করুন",
        aiMedicalDiagnosis: "AI চিকিৎসা রোগ নির্ণয়",
        getAiDiagnosis: "AI রোগ নির্ণয় পান",
        downloadPDF: "PDF ডাউনলোড করুন",
        mostLikely: "সবচেয়ে সম্ভাব্য", confidence: "আস্থা",
        ex_fever: "জ্বর, মাথাব্যথা, শরীর ব্যথা", ex_cough: "কাশি, গলা ব্যথা",
    },

    Gujarati: {
        ...commonKeys,
        title: "IAP-MG GenAI ઉપયોગ કરીને", welcomeBack: "પાછા સ્વાગત છે",
        login: "લૉગિન", logout: "લૉગઆઉટ",
        welcomeBackUser: "પાછા સ્વાગત છે, {name}", startNewDiagnosis: "નવી નિદાન શરૂ કરો",
        settings: "સેટિંગ્સ", changeLanguage: "ભાષા બદલો",
        cancel: "રદ્દ કરો", confirm: "પુષ્ટિ કરો",
        aiMedicalDiagnosis: "AI તબીબી નિદાન",
        getAiDiagnosis: "AI નિદાન મેળવો",
        downloadPDF: "PDF ડાઉનલોડ કરો",
        mostLikely: "સૌથી સંભવ", confidence: "વિશ્વાસ",
        ex_fever: "તાવ, માથાનો દુખાવો, શરીરનો દુખાવો", ex_cough: "ઉધરસ, ગળાનો દુખાવો",
    },

    Punjabi: {
        ...commonKeys,
        title: "IAP-MG GenAI ਵਰਤ ਕੇ", welcomeBack: "ਵਾਪਸ ਸੁਆਗਤ ਹੈ",
        login: "ਲੌਗਇਨ", logout: "ਲੌਗਆਉਟ",
        welcomeBackUser: "ਵਾਪਸ ਸੁਆਗਤ ਹੈ, {name}", startNewDiagnosis: "ਨਵੀਂ ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ",
        settings: "ਸੈਟਿੰਗਾਂ", changeLanguage: "ਭਾਸ਼ਾ ਬਦਲੋ",
        cancel: "ਰੱਦ ਕਰੋ", confirm: "ਪੁਸ਼ਟੀ ਕਰੋ",
        aiMedicalDiagnosis: "AI ਡਾਕਟਰੀ ਜਾਂਚ",
        getAiDiagnosis: "AI ਜਾਂਚ ਪ੍ਰਾਪਤ ਕਰੋ",
        downloadPDF: "PDF ਡਾਊਨਲੋਡ ਕਰੋ",
        mostLikely: "ਸਭ ਤੋਂ ਸੰਭਾਵਿਤ", confidence: "ਭਰੋਸਾ",
        ex_fever: "ਬੁਖਾਰ, ਸਿਰਦਰਦ, ਸਰੀਰ ਦਰਦ", ex_cough: "ਖੰਘ, ਗਲੇ ਵਿੱਚ ਦਰਦ",
    },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem(STORAGE_KEYS?.LANGUAGE) || 'English');

    const translate = (key, params = {}) => {
        let text = translations[language]?.[key] || translations['English']?.[key] || key;
        Object.entries(params).forEach(([k, v]) => { text = text.replace(`{${k}}`, v); });
        return text;
    };

    const changeLanguage = (newLang) => {
        if (translations[newLang]) {
            setLanguage(newLang);
            localStorage.setItem(STORAGE_KEYS?.LANGUAGE || 'language', newLang);
        }
    };

    const availableLanguages = Object.keys(translations).map(name => ({
        name,
        nativeName: { Telugu: 'తెలుగు', Hindi: 'हिन्दी', Tamil: 'தமிழ்', Kannada: 'ಕನ್ನಡ', Malayalam: 'മലയാളം', Marathi: 'मराठी', Bengali: 'বাংলা', Gujarati: 'ગુજરાતી', Punjabi: 'ਪੰਜਾਬੀ', English: 'English' }[name] || name
    }));

    return (
        <LanguageContext.Provider value={{ language, translate, changeLanguage, availableLanguages }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
export default LanguageContext;
