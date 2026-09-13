const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Jimp = require('jimp');

async function extractText(inputPath, sourceFormat, originalName) {
  try {
    if (['txt', 'html'].includes(sourceFormat)) {
      return fs.readFileSync(inputPath, 'utf8');
    }
    if (sourceFormat === 'pdf') {
      const dataBuffer = fs.readFileSync(inputPath);
      const data = await pdfParse(dataBuffer);
      return data.text || 'No text found in PDF';
    }
    if (sourceFormat === 'docx') {
      const result = await mammoth.extractRawText({ path: inputPath });
      return result.value || 'No text found in DOCX';
    }
    return `Generic content extracted from ${originalName} (${sourceFormat.toUpperCase()})`;
  } catch (err) {
    console.error(`Error extracting text: ${err.message}`);
    return `Fallback content: Could not extract text from ${originalName}.\n\nNote: If this is a scanned PDF or Image, text extraction requires OCR software which is not currently installed in this demo.`;
  }
}

async function convertFile(inputPath, outputPath, sourceFormat, targetFormat, originalName) {
  const textContent = await extractText(inputPath, sourceFormat, originalName);

  if (targetFormat === 'txt') {
    fs.writeFileSync(outputPath, textContent);
  } 
  else if (targetFormat === 'html') {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${originalName}</title></head><body><pre style="white-space: pre-wrap; font-family: sans-serif;">${textContent}</pre></body></html>`;
    fs.writeFileSync(outputPath, html);
  } 
  else if (targetFormat === 'pdf') {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);
      
      const fontPath = path.join(__dirname, 'Sarabun-Regular.ttf');
      if (fs.existsSync(fontPath)) {
        doc.font(fontPath);
      } else {
        doc.font('Helvetica');
      }

      doc.fontSize(12).text(textContent, {
        align: 'left'
      });
      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  } 
  else if (targetFormat === 'docx') {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: textContent.split('\n').map(line => 
            new Paragraph({
              children: [new TextRun(line)],
            })
          ),
        },
      ],
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
  }
  else if (['png', 'jpg'].includes(targetFormat)) {
    // Generate a simple image with the first 100 chars of text
    const image = new Jimp(800, 600, 0xFFFFFFFF); // White background
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    const displaySnippet = textContent.length > 500 ? textContent.substring(0, 500) + '...' : textContent;
    image.print(font, 20, 20, {
      text: displaySnippet,
      alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP
    }, 760, 560);
    await image.writeAsync(outputPath);
  } 
  else {
    throw new Error(`Unsupported target format: ${targetFormat}`);
  }
}

module.exports = { convertFile };
