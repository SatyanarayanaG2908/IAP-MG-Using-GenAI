const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = (userData, symptoms, analysisResult, language) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const fileName = `diagnosis_${Date.now()}.pdf`;
            const uploadDir = path.join(__dirname, '../public/reports');

            // Ensure directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Header
            doc.fillColor('#444444')
                .fontSize(20)
                .text('Smart Medical Diagnosis Report', { align: 'center' })
                .fontSize(10)
                .text(new Date().toLocaleString(), { align: 'center' });

            doc.moveDown();
            doc.circle(550, 50, 20).fill('#667eea');

            // Patient Info
            doc.fontSize(14).text('Patient Information', { underline: true });
            doc.fontSize(12).text(`Name: ${userData.username}`);
            doc.text(`Age: ${userData.age} | Gender: ${userData.gender}`);
            doc.text(`Medical Conditions: ${userData.medical_conditions?.join(', ') || 'None'}`);
            doc.moveDown();

            // Symptoms
            doc.fontSize(14).text('Symptoms Reported', { underline: true });
            doc.fontSize(12).text(symptoms);
            doc.moveDown();

            // Diagnosis
            doc.fontSize(14).text('Diagnosis Results', { underline: true });
            if (analysisResult.diseases) {
                analysisResult.diseases.forEach((disease, i) => {
                    doc.fontSize(12).fillColor('#000000').text(`${i + 1}. ${disease.name} (${disease.confidence}%)`, { continued: false });
                    doc.fontSize(10).fillColor('#666666').text(disease.reasoning);
                    doc.moveDown(0.5);
                });
            }
            doc.moveDown();

            // Treatment
            doc.fontSize(14).fillColor('#444444').text('Treatment Plan', { underline: true });
            if (analysisResult.medical_plan && analysisResult.medical_plan.medicines) {
                analysisResult.medical_plan.medicines.forEach(med => {
                    doc.fontSize(12).fillColor('#000000').text(`- ${med.name}: ${med.dosage} (${med.frequency})`);
                });
            }
            doc.moveDown();

            // Footer
            doc.fontSize(10).fillColor('grey').text('Disclaimer: This is an AI-generated report. Consult a doctor for professional advice.',
                50, doc.page.height - 50, { align: 'center' });

            doc.end();

            stream.on('finish', () => {
                const publicUrl = `/reports/${fileName}`; // Assuming static file serving
                resolve({
                    success: true,
                    url: publicUrl,
                    filePath: filePath
                });
            });

            stream.on('error', (err) => {
                reject(err);
            });

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generatePDF };
