const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = (userData, symptoms, analysisResult, language) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            // 🔥 CLEAN USERNAME
            const cleanName = userData?.username
                ? userData.username.replace(/\s+/g, '_').toLowerCase()
                : 'user';

            // 🔥 CURRENT DATE FORMAT (DD-MM-YYYY)
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();

            const formattedDate = `${day}-${month}-${year}`;

            // 🔥 FINAL FILE NAME
            const fileName = `${cleanName}_report_${formattedDate}.pdf`;

            const uploadDir = path.join(__dirname, '../public/reports');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // ===== YOUR EXISTING PDF CONTENT =====

            doc.fillColor('#444444')
                .fontSize(20)
                .text('Smart Medical Diagnosis Report', { align: 'center' })
                .fontSize(10)
                .text(new Date().toLocaleString(), { align: 'center' });

            doc.moveDown();
            doc.circle(550, 50, 20).fill('#667eea');

            doc.fontSize(14).text('Patient Information', { underline: true });
            doc.fontSize(12).text(`Name: ${userData.username}`);
            doc.text(`Age: ${userData.age} | Gender: ${userData.gender}`);
            doc.text(`Medical Conditions: ${userData.medical_conditions?.join(', ') || 'None'}`);
            doc.moveDown();

            doc.fontSize(14).text('Symptoms Reported', { underline: true });
            doc.fontSize(12).text(symptoms);
            doc.moveDown();

            doc.fontSize(14).text('Diagnosis Results', { underline: true });

            if (analysisResult.diseases) {
                analysisResult.diseases.forEach((disease, i) => {
                    doc.fontSize(12)
                        .fillColor('#000000')
                        .text(`${i + 1}. ${disease.name} (${disease.confidence}%)`);

                    doc.fontSize(10)
                        .fillColor('#666666')
                        .text(disease.reasoning);

                    doc.moveDown(0.5);
                });
            }

            doc.moveDown();

            doc.fontSize(14)
                .fillColor('#444444')
                .text('Treatment Plan', { underline: true });

            if (analysisResult.medical_plan?.medicines) {
                analysisResult.medical_plan.medicines.forEach(med => {
                    doc.fontSize(12)
                        .fillColor('#000000')
                        .text(`- ${med.name}: ${med.dosage} (${med.frequency})`);
                });
            }

            doc.moveDown();

            doc.fontSize(10)
                .fillColor('grey')
                .text(
                    'Disclaimer: This is an AI-generated report. Consult a doctor for professional advice.',
                    50,
                    doc.page.height - 50,
                    { align: 'center' }
                );

            doc.end();

            stream.on('finish', () => {
                resolve({
                    success: true,
                    url: `/reports/${fileName}`,
                    filePath: filePath
                });
            });

            stream.on('error', reject);

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generatePDF };