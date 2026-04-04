const ExcelJS = require('exceljs');

/**
 * Generates an Excel Workbook from structured AI analysis data.
 */
const generateExcelReport = async (analysisDoc) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'AI Resume Analyzer Pro';
  const worksheet = workbook.addWorksheet('Elite Candidate Profile');

  // Define highly stylized columns
  worksheet.columns = [
    { header: 'Metric Category', key: 'category', width: 25 },
    { header: 'Details', key: 'data', width: 60 },
    { header: 'Score/Impact', key: 'score', width: 15 },
  ];

  // Header Row Styling
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2937' } };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  const extracted = analysisDoc.extractedData.resume || {};
  
  // Section: Basic Info
  worksheet.addRow(['Name', extracted.personalInfo?.name || 'N/A', '-']);
  worksheet.addRow(['Email', extracted.personalInfo?.email || 'N/A', '-']);
  worksheet.addRow(['Phone', extracted.personalInfo?.phone || 'N/A', '-']);
  
  worksheet.addRow([]); // Blank spacer

  // Section: Elite Scoring
  const scores = analysisDoc.scores || {};
  worksheet.addRow(['Overall Match Score', `${scores.overallScore || 0}/100`, (scores.overallScore >= 75) ? 'High' : 'Low']);
  worksheet.addRow(['ATS Formatting Score', `${scores.atsScore || 0}/100`, '-']);
  worksheet.addRow(['Benchmarking', analysisDoc.benchmarking?.category || 'Average', '-']);

  worksheet.addRow([]);

  // Section: Skills Data
  const missing = analysisDoc.suggestions?.missingSkills || [];
  worksheet.addRow(['Total Skills Found', (extracted.skills || []).length, '-']);
  worksheet.addRow(['Missing Critical Skills', missing.length > 0 ? missing.join(', ') : 'None missing', missing.length > 0 ? 'High Impact' : 'Good']);

  worksheet.addRow([]);
  
  // Section: Quick Wins priority
  const quickWins = analysisDoc.insights?.quickWins || [];
  quickWins.forEach((win, idx) => {
    worksheet.addRow([`Quick Win #${idx+1}`, win, 'Fix Now']);
  });

  // Apply basic wrap text formatting to data cells
  worksheet.eachRow((row) => {
    row.getCell(2).alignment = { wrapText: true };
  });

  // Return generated buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

module.exports = { generateExcelReport };
