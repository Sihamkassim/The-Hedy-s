const fs = require('fs');
const pdfParse = require('pdf-parse');
const officeParser = require('officeparser');

exports.parseFileToText = async (filePath, mimetype) => {
  if (mimetype === 'application/pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return String(data.text || '');
  } else if (mimetype === 'text/plain') {
    return fs.readFileSync(filePath, 'utf8');
  } else {
    // Attempt office parsing for docx, pptx
    try {
      const data = await officeParser.parseOffice(filePath);
      return String(data); // Ensure it's a string
    } catch (err) {
      throw err;
    }
  }
};

// Simple chunking algorithm by character length (could be optimized)
exports.chunkText = (text, maxLength = 1000) => {
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;

  for (const word of words) {
    if (currentLength + word.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [];
      currentLength = 0;
    }
    currentChunk.push(word);
    currentLength += word.length + 1; // +1 for space
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
};