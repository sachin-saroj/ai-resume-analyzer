const mammoth = require('mammoth');
const { PDFParse } = require('pdf-parse');

/**
 * Extracts raw text from a PDF Buffer using pdf-parse v2 API.
 */
const extractFromPDF = async (buffer) => {
  let parser;
  try {
    // pdf-parse v2 API: pass { data: buffer } then call getText()
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    
    if (result && result.text && result.text.trim().length > 0) {
      return result.text;
    }
  } catch (err) {
    console.warn('[PDF] pdf-parse v2 getText() failed:', err.message);
  } finally {
    // Always destroy to free memory
    try { if (parser) await parser.destroy(); } catch {}
  }

  // Fallback: Manual raw text extraction from PDF buffer
  try {
    const text = extractTextFromPDFBuffer(buffer);
    if (text && text.trim().length > 20) {
      console.log('[PDF] Fallback raw extraction succeeded, length:', text.length);
      return text;
    }
  } catch (err) {
    console.warn('[PDF] Raw extraction failed:', err.message);
  }

  throw new Error('Failed to parse PDF file. Document might be corrupted or image-based.');
};

/**
 * Raw PDF text extraction fallback.
 * Parses the PDF buffer directly looking for text content.
 */
const extractTextFromPDFBuffer = (buffer) => {
  const raw = buffer.toString('latin1');
  const lines = [];

  // Method 1: Extract text between parentheses in text streams (BT...ET blocks)
  const textObjRegex = /BT\s*([\s\S]*?)\s*ET/g;
  let match;
  while ((match = textObjRegex.exec(raw)) !== null) {
    const block = match[1];
    const strRegex = /\(([^)]*)\)/g;
    let strMatch;
    while ((strMatch = strRegex.exec(block)) !== null) {
      const decoded = decodePDFString(strMatch[1]);
      if (decoded.trim().length > 0) {
        lines.push(decoded);
      }
    }
  }

  // Method 2: Global parenthesized strings if BT/ET yielded too little
  if (lines.length < 5) {
    const globalStrRegex = /\(([^)]{2,200})\)/g;
    while ((match = globalStrRegex.exec(raw)) !== null) {
      const decoded = decodePDFString(match[1]);
      if (decoded.trim().length > 1 && 
          !decoded.startsWith('/') && 
          !decoded.match(/^[0-9\s.]+$/) &&
          !decoded.includes('Adobe') &&
          !decoded.includes('Producer') &&
          !decoded.includes('CreationDate')) {
        lines.push(decoded);
      }
    }
  }

  // Deduplicate
  const seen = new Set();
  const unique = lines.filter(l => {
    const trimmed = l.trim();
    if (seen.has(trimmed) || trimmed.length === 0) return false;
    seen.add(trimmed);
    return true;
  });

  return unique.join('\n');
};

/**
 * Decodes PDF escape sequences in parenthesized strings.
 */
const decodePDFString = (str) => {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\')
    .replace(/\\([()])/g, '$1')
    .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
};

/**
 * Extracts raw text from a DOCX Buffer.
 */
const extractFromDOCX = async (buffer) => {
  try {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  } catch (error) {
    throw new Error('Failed to parse DOCX file. Document might be corrupted.');
  }
};

/**
 * Normalizes extracted text (Layer 2)
 */
const cleanRawText = (rawText) => {
  if (!rawText) return '';
  return rawText
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
};

/**
 * Master Extraction function mapping to correct parser.
 */
const extractResumeText = async (file) => {
  let rawText = '';
  
  const mimetype = file.mimetype || '';
  const filename = (file.originalname || file.filename || '').toLowerCase();

  const isPDF = mimetype === 'application/pdf' || filename.endsWith('.pdf');
  const isDOCX = mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filename.endsWith('.docx');

  if (isPDF) {
    rawText = await extractFromPDF(file.buffer);
  } else if (isDOCX) {
    rawText = await extractFromDOCX(file.buffer);
  } else {
    console.warn('[Extractor] Unknown mimetype:', mimetype, '- trying all parsers');
    try {
      rawText = await extractFromPDF(file.buffer);
    } catch {
      try {
        rawText = await extractFromDOCX(file.buffer);
      } catch {
        throw new Error(`Unsupported file format: ${mimetype}. Please upload a PDF or DOCX file.`);
      }
    }
  }
  
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('No text detected in document. Please upload a text-based PDF/DOCX, not a scanned image.');
  }
  
  return cleanRawText(rawText);
};

module.exports = { extractResumeText, cleanRawText };
