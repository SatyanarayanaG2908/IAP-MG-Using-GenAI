const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = (userData, symptoms, analysisResult) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("🚀 Starting PDF generation...");

            const doc = new PDFDocument({ margin: 50 });

            const cleanName = (userData?.username || 'user')
                .replace(/\s+/g, '_')
                .toLowerCase();

            const now = new Date();
            const date = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth()+1).padStart(2, '0')}-${now.getFullYear()}`;

            const fileName = `${cleanName}_report_${date}.pdf`;

            const uploadDir = path.join(__dirname, '../public/reports');

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filePath = path.join(uploadDir, fileName);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // ===== CONTENT =====
            doc.fontSize(20).text('Medical Diagnosis Report', { align: 'center' });
            doc.moveDown();

            doc.fontSize(14).text('Patient Information');
            doc.text(`Name: ${userData.username}`);
            doc.text(`Age: ${userData.age}`);
            doc.text(`Gender: ${userData.gender}`);

            doc.moveDown();
            doc.text('Symptoms');
            doc.text(symptoms);

            doc.moveDown();
            doc.text('Diagnosis');

            const diseases = analysisResult?.diseases || [];

            diseases.forEach((d, i) => {
                doc.text(`${i + 1}. ${d.name} (${d.confidence}%)`);
            });

            doc.end();

            stream.on('finish', () => {
                console.log("✅ PDF created:", filePath);
                resolve({
                    success: true,
                    url: `/reports/${fileName}`
                });
            });

            stream.on('error', (err) => {
                console.error("❌ Stream error:", err);
                reject(err);
            });

        } catch (err) {
            console.error("❌ PDF error:", err);
            reject(err);
        }
    });
};

module.exports = { generatePDF };