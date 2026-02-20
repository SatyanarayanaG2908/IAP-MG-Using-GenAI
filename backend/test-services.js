// FILE PATH: backend/test-services.js
// Run this to check all service configurations

const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('\n🔍 CHECKING ALL SERVICE CONFIGURATIONS...\n');

// ── Step 1: Check Environment Variables ──────────────────────────────────────
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 1: Environment Variables');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const envVars = {
    'PDF_SERVICE_URL': process.env.PDF_SERVICE_URL,
    'EMAIL_USER': process.env.EMAIL_USER,
    'EMAIL_PASSWORD': process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET',
    'GEMINI_API_KEY': process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-8) : 'NOT SET',
};

Object.entries(envVars).forEach(([key, value]) => {
    const status = value && value !== 'NOT SET' ? '✅' : '❌';
    console.log(`${status} ${key}: ${value || 'NOT SET'}`);
});

// ── Step 2: Test PDF Service ─────────────────────────────────────────────────
async function testPDFService() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 2: Testing PDF Service');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const pdfUrl = process.env.PDF_SERVICE_URL || 'http://localhost:5001';

    try {
        const response = await axios.get(`${pdfUrl}/health`, { timeout: 3000 });
        console.log('✅ PDF Service is RUNNING');
        console.log('   Response:', response.data.message);
    } catch (error) {
        console.log('❌ PDF Service is NOT RUNNING');
        console.log('   Error:', error.message);
        console.log('   Fix: Run → python python-services/pdf_service/app.py');
    }
}

// ── Step 3: Test Email Configuration ─────────────────────────────────────────
async function testEmail() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 3: Testing Email Configuration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPassword) {
        console.log('❌ Email credentials NOT SET in .env');
        console.log('   Required: EMAIL_USER and EMAIL_PASSWORD');
        return;
    }

    console.log('📧 Email User:', emailUser);
    console.log('🔑 Password Length:', emailPassword.length, 'characters');

    if (emailPassword.length !== 16) {
        console.log('⚠️  WARNING: Gmail App Password should be 16 characters');
        console.log('   Current length:', emailPassword.length);
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPassword,
            },
        });

        await transporter.verify();
        console.log('✅ Email configuration is VALID');
    } catch (error) {
        console.log('❌ Email configuration FAILED');
        console.log('   Error:', error.message);

        if (error.message.includes('Invalid login')) {
            console.log('\n   🔧 FIX:');
            console.log('   1. Enable 2FA: https://myaccount.google.com/security');
            console.log('   2. Generate App Password: https://myaccount.google.com/apppasswords');
            console.log('   3. Copy 16-digit password (no spaces) to .env');
        }
    }
}

// ── Step 4: Test Translation Service ─────────────────────────────────────────
async function testTranslationService() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 4: Testing Translation Service (Optional)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const translationUrl = process.env.TRANSLATION_SERVICE_URL || 'http://localhost:5002';

    try {
        const response = await axios.get(`${translationUrl}/health`, { timeout: 3000 });
        console.log('✅ Translation Service is RUNNING');
    } catch (error) {
        console.log('⚠️  Translation Service is NOT RUNNING (optional)');
        console.log('   Run → python python-services/translation_service/app.py');
    }
}

// ── Run All Tests ────────────────────────────────────────────────────────────
async function runAllTests() {
    await testPDFService();
    await testEmail();
    await testTranslationService();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ = Working | ❌ = Not Working | ⚠️  = Optional\n');
}

runAllTests().catch(console.error);