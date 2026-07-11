const fs = require('fs');
const HTMLtoDOCX = require('html-to-docx');

(async () => {
    try {
        console.log('Reading HTML file...');
        const htmlString = fs.readFileSync('SDG4_EduPathAI_LenLeap.html', 'utf-8');
        
        console.log('Converting to DOCX...');
        const fileBuffer = await HTMLtoDOCX(htmlString, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        });
        
        fs.writeFileSync('SDG4_EduPathAI_LenLeap.docx', fileBuffer);
        console.log('Successfully created SDG4_EduPathAI_LenLeap.docx');
    } catch (error) {
        console.error('Error generating DOCX:', error);
    }
})();
