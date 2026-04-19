// file:backend/services/emailServices.js 
const nodemailer = require('nodemailer');

const createTransporter = () => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Debug logs (important)
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "EXISTS" : "MISSING");

    if (!transporter) {
        console.log("❌ Transporter creation failed");
    } else {
        console.log("✅ Transporter created successfully");
    }

    return transporter;
};

exports.sendEmail = async ({ to, subject, html, text, attachments }) => {   // ✅ added attachments
    try {
        const transporter = createTransporter();

        if (!transporter) {
            throw new Error("Transporter is undefined");
        }

        const info = await transporter.sendMail({
            from: `"IAP-MG Medical" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            text: text || html?.replace(/<[^>]*>/g, ''),
            attachments: attachments || []   // ✅ added
        });

        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email error:', error.message);
        return { success: false, message: error.message };
    }
};

exports.sendDiagnosisReport = async (userEmail, userName, sessionData, pdfBuffer) => {  // ✅ added pdfBuffer
    const subject = `Your Medical Diagnosis Report - IAP-MG`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #7c3aed); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🏥 IAP-MG Using GenAI</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">AI-Powered Medical Diagnosis Report</p>
        </div>
        
        <p style="color: #374151;">Dear <strong>${userName}</strong>,</p>
        <p style="color: #374151;">Your AI diagnosis report is ready. Here is a summary:</p>
        
        ${sessionData?.finalDisease ? `
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #065f46; font-weight: bold;">Primary Diagnosis</p>
            <p style="margin: 4px 0 0; color: #047857; font-size: 18px;">${sessionData.finalDisease}</p>
        </div>` : ''}
        
        ${sessionData?.symptoms ? `
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Reported Symptoms</p>
            <p style="margin: 4px 0 0; color: #374151;">${sessionData.symptoms}</p>
        </div>` : ''}
        
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 12px; font-weight: bold; text-transform: uppercase;">⚠️ Medical Disclaimer</p>
            <p style="margin: 8px 0 0; color: #1d4ed8; font-size: 13px;">This is an AI-generated report for educational purposes only. Please consult a qualified healthcare provider for professional medical advice.</p>
        </div>
        
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p style="color: #6b7280; font-size: 12px;">IAP-MG Using GenAI — Bapatla Engineering College</p>
    </div>`;

    return exports.sendEmail({
        to: userEmail,
        subject,
        html,
        attachments: pdfBuffer   // ✅ added PDF
            ? [{
                filename: "Diagnosis_Report.pdf",
                content: pdfBuffer,
            }]
            : []
    });
};