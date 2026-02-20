// FILE PATH: backend/config/gemini.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiModel = () => {
    return genAI.getGenerativeModel({
        model: 'gemini-1.5-flash'
    });
};

const generationConfig = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
    responseMimeType: 'application/json',
};

module.exports = {
    getGeminiModel,
    generationConfig,
};