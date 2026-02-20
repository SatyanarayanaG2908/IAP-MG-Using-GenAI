// FILE PATH: backend/services/emailService.js

const nodemailer = require('nodemailer');

// Safe createTransport - works with nodemailer v5, v6, v7
const createTransporter = () => {
  // nodemailer v6 uses createTransport
  const fn = nodemailer.createTransport || nodemailer.createTransporter;
  if (!fn) throw new Error('nodemailer not properly installed. Run: npm install nodemailer@6');
  return fn.call(nodemailer, {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

exports.isConfigured = () => !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

exports.sendDiagnosisReport = async ({ user, session, language, pdfBuffer }) => {
  try {
    if (!exports.isConfigured()) {
      return { success: false, message: 'Email service not configured. Add EMAIL_USER and EMAIL_PASSWORD to .env' };
    }

    const transporter = createTransporter();

    const diseasesHTML = (session.diseases || []).map((d, i) => `
            <tr style="background:${i === 0 ? '#dbeafe' : i % 2 === 0 ? '#fff' : '#f8fafc'};">
                <td style="padding:12px;border:1px solid #ddd;text-align:center;font-weight:bold;">#${i + 1}</td>
                <td style="padding:12px;border:1px solid #ddd;"><strong>${d.name}</strong></td>
                <td style="padding:12px;border:1px solid #ddd;text-align:center;color:#16a34a;font-weight:bold;">${d.confidence}%</td>
            </tr>`).join('');

    const attachments = [];
    if (pdfBuffer) {
      attachments.push({
        filename: `Medical_Report_${session.sessionId}.pdf`,
        content: Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer),
        contentType: 'application/pdf',
      });
    }

    const mailOptions = {
      from: `"IAP-MG Using GenAI" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🏥 Your Medical Diagnosis Report - IAP-MG Using GenAI',
      attachments,
      html: `<!DOCTYPE html><html><head><style>
                body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background:#f4f4f4;}
                .container{max-width:600px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);}
                .header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:30px;text-align:center;}
                .content{padding:30px;}
                table{width:100%;border-collapse:collapse;margin:20px 0;}
                th{background:#2563eb;color:#fff;padding:12px;text-align:left;}
                .disclaimer{background:#fff3cd;border-left:4px solid #ffc107;padding:15px;margin:20px 0;border-radius:6px;}
                .footer{text-align:center;padding:20px;background:#f8fafc;color:#666;font-size:12px;}
            </style></head><body>
            <div class="container">
                <div class="header"><h1>🏥 Medical Diagnosis Report</h1><p>AI-Powered Health Assessment</p></div>
                <div class="content">
                    <h2>Dear ${user.fullName || user.email},</h2>
                    <p>Your AI-powered medical diagnosis report is ready:</p>
                    <table>
                        <thead><tr><th>Rank</th><th>Condition</th><th>Confidence</th></tr></thead>
                        <tbody>${diseasesHTML}</tbody>
                    </table>
                    ${pdfBuffer ? '<p style="text-align:center;padding:10px;background:#f0fdf4;border-radius:8px;"><strong>📎 Full PDF report is attached.</strong></p>' : ''}
                    <div class="disclaimer"><strong>⚠️ Disclaimer:</strong> This is AI guidance only. Always consult a qualified healthcare provider.</div>
                </div>
                <div class="footer"><p><strong>IAP-MG Using GenAI</strong></p><p>${new Date().toLocaleString('en-IN')}</p></div>
            </div></body></html>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully', messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: error.message };
  }
};

exports.sendTestEmail = async (email, firstName = 'User') => {
  try {
    if (!exports.isConfigured()) return { success: false, message: 'Email service not configured' };
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"IAP-MG Using GenAI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Test Email - IAP-MG Using GenAI',
      html: `<body style="font-family:Arial,sans-serif;padding:20px;">
                <h2>Hello ${firstName}! 👋</h2>
                <p>Your email is working correctly!</p>
                <p style="color:#666;font-size:12px;">Sent on ${new Date().toLocaleString()}</p>
            </body>`,
    });
    return { success: true, message: 'Test email sent', messageId: info.messageId };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

exports.sendReminderEmail = async (reminder) => {
  try {
    if (!exports.isConfigured()) return { success: false, message: 'Email service not configured' };
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"IAP-MG Using GenAI" <${process.env.EMAIL_USER}>`,
      to: reminder.email,
      subject: `🔔 Health Reminder - IAP-MG Using GenAI`,
      html: `<body style="font-family:Arial,sans-serif;padding:20px;">
                <h2>🔔 Health Reminder</h2>
                <p>${reminder.message}</p>
                <p><strong>Scheduled:</strong> ${new Date(reminder.scheduledFor).toLocaleString()}</p>
                <p style="color:#666;font-size:12px;">IAP-MG Using GenAI</p>
            </body>`,
    });
    return { success: true, message: 'Reminder sent', messageId: info.messageId };
  } catch (error) {
    return { success: false, message: error.message };
  }
};