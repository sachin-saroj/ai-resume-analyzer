const { baseOntology } = require('../ontology/skillOntology');

/**
 * Local NLP-based Resume Extractor
 * Extracts structured data from raw resume text using regex and ontology mapping.
 * No OpenAI dependency — fully offline capable.
 */

// --- Personal Info Extraction ---
const extractPersonalInfo = (text) => {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}/);

  // Name: typically the first non-empty line
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let name = null;
  for (const line of lines.slice(0, 5)) {
    // Skip lines that look like emails, phones, URLs, or section headers
    if (line.includes('@') || line.match(/^[\d(+]/) || line.match(/^http/i)) continue;
    if (line.match(/^(summary|objective|profile|experience|education|skills)/i)) continue;
    if (line.length > 3 && line.length < 60) {
      name = line.replace(/[|•·—–-]/g, '').trim();
      break;
    }
  }

  return {
    name: name || 'Unknown Candidate',
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0].trim() : null
  };
};

// --- Skills Extraction via Ontology ---
const extractSkills = (text) => {
  const normalizedText = text.toLowerCase();
  const foundSkills = new Set();

  for (const [category, skills] of Object.entries(baseOntology)) {
    for (const skill of skills) {
      // Word boundary matching for skills
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[\\s,;|/\\(])${escaped}(?:[\\s,;|/\\).]|$)`, 'i');
      if (regex.test(normalizedText)) {
        // Store canonical form (Title Case)
        foundSkills.add(skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      }
    }
  }

  // Also try to find skills in explicit "Skills" sections
  const skillSectionMatch = text.match(/(?:skills|technologies|tech stack|technical skills)[:\s]*([^\n]*(?:\n(?![A-Z][a-z]+:)[^\n]*)*)/i);
  if (skillSectionMatch) {
    const skillsText = skillSectionMatch[1];
    const tokens = skillsText.split(/[,;|•·\/\n]+/).map(t => t.trim()).filter(t => t.length > 1 && t.length < 40);
    tokens.forEach(t => {
      const normalized = t.toLowerCase().trim();
      for (const skills of Object.values(baseOntology)) {
        if (skills.includes(normalized)) {
          foundSkills.add(t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        }
      }
    });
  }

  return [...foundSkills];
};

// --- Experience Roles Extraction ---
const extractExperience = (text) => {
  const roles = [];

  // Find experience section
  const expMatch = text.match(/(?:experience|work history|employment|professional background)[:\s]*([\s\S]*?)(?=\n\s*(?:education|projects|skills|certifications|awards|references|$))/i);
  if (!expMatch) return roles;

  const expText = expMatch[1];
  // Split by patterns that look like role headers (Title at/- Company, Date patterns)
  const roleBlocks = expText.split(/\n(?=[A-Z][^\n]*(?:at|@|–|—|-|,)\s*[A-Z])/);

  for (const block of roleBlocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) continue;

    const titleLine = lines[0];
    // Try to parse: Title at Company | Date
    const titleMatch = titleLine.match(/^(.+?)(?:\s+(?:at|@|–|—|-|,)\s+)(.+?)(?:\s*[|•]\s*(.+))?$/i);

    let title = titleMatch ? titleMatch[1].trim() : titleLine.substring(0, 60);
    let company = titleMatch ? titleMatch[2].trim() : 'Company';
    let duration = titleMatch && titleMatch[3] ? titleMatch[3].trim() : null;

    // If no duration found, look for date patterns in next lines
    if (!duration) {
      for (const line of lines.slice(1, 3)) {
        const dateMatch = line.match(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\s*\d{4}\s*[-–—to]+\s*(?:present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)?\s*\d{0,4}/i);
        if (dateMatch) { duration = dateMatch[0]; break; }
      }
    }

    const description = lines.slice(1).join('\n').substring(0, 500);

    // Extract technologies mentioned in this block
    const blockText = block.toLowerCase();
    const techs = [];
    for (const skills of Object.values(baseOntology)) {
      for (const skill of skills) {
        if (blockText.includes(skill.toLowerCase()) && !techs.includes(skill)) {
          techs.push(skill);
        }
      }
    }

    roles.push({ title, company, duration, description, technologies: techs.slice(0, 10) });
  }

  return roles.slice(0, 10);
};

// --- Education Extraction ---
const extractEducation = (text) => {
  const education = [];

  const eduMatch = text.match(/(?:education|academic|qualifications)[:\s]*([\s\S]*?)(?=\n\s*(?:experience|projects|skills|certifications|awards|references|$))/i);
  if (!eduMatch) return education;

  const eduText = eduMatch[1];
  const lines = eduText.split('\n').map(l => l.trim()).filter(l => l.length > 3);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const degreePatterns = /(?:b\.?s\.?|m\.?s\.?|b\.?tech|m\.?tech|bachelor|master|phd|ph\.d|mba|b\.?e\.?|m\.?e\.?|diploma|associate|doctorate)/i;
    if (degreePatterns.test(line) || (i === 0 && line.length > 5)) {
      const yearMatch = line.match(/20\d{2}|19\d{2}/);
      const nextLine = lines[i + 1] || '';
      const yearFromNext = nextLine.match(/20\d{2}|19\d{2}/);

      education.push({
        degree: line.replace(/\d{4}/g, '').trim().substring(0, 100),
        institution: nextLine && !degreePatterns.test(nextLine) ? nextLine.substring(0, 100) : 'Institution',
        year: yearMatch ? yearMatch[0] : (yearFromNext ? yearFromNext[0] : null)
      });
    }
  }

  return education.slice(0, 5);
};

// --- Projects Extraction ---
const extractProjects = (text) => {
  const projects = [];

  const projMatch = text.match(/(?:projects|personal projects|side projects)[:\s]*([\s\S]*?)(?=\n\s*(?:experience|education|skills|certifications|awards|references|$))/i);
  if (!projMatch) return projects;

  const projText = projMatch[1];
  const blocks = projText.split(/\n(?=[A-Z•·–—-])/);

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) continue;

    const name = lines[0].replace(/^[•·–—-]\s*/, '').substring(0, 80);
    const description = lines.slice(1).join(' ').substring(0, 300);

    const blockLower = block.toLowerCase();
    const techs = [];
    for (const skills of Object.values(baseOntology)) {
      for (const skill of skills) {
        if (blockLower.includes(skill) && !techs.includes(skill)) techs.push(skill);
      }
    }

    if (name.length > 2) {
      projects.push({ name, description, technologies: techs.slice(0, 8) });
    }
  }

  return projects.slice(0, 8);
};

/**
 * Master local extraction function.
 * Returns structured resume data identical to what OpenAI would return.
 */
const extractStructuredResume = (rawText) => {
  return {
    personalInfo: extractPersonalInfo(rawText),
    skills: extractSkills(rawText),
    experienceRoles: extractExperience(rawText),
    education: extractEducation(rawText),
    projects: extractProjects(rawText)
  };
};

/**
 * Local JD extraction function.
 */
const extractStructuredJD = (rawJDText) => {
  const normalizedText = rawJDText.toLowerCase();
  const allSkills = [];

  for (const skills of Object.values(baseOntology)) {
    for (const skill of skills) {
      if (normalizedText.includes(skill.toLowerCase())) {
        allSkills.push(skill);
      }
    }
  }

  // First 60% are "critical", rest are "secondary"
  const splitIndex = Math.max(1, Math.ceil(allSkills.length * 0.6));
  const criticalSkills = allSkills.slice(0, splitIndex);
  const secondarySkills = allSkills.slice(splitIndex);

  // Try to extract job title from the first meaningful line
  const lines = rawJDText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
  let jobTitle = 'Software Engineer';
  for (const line of lines.slice(0, 5)) {
    if (line.match(/engineer|developer|architect|manager|analyst|designer|scientist|lead/i)) {
      jobTitle = line.substring(0, 80);
      break;
    }
  }

  // Experience years
  const yearsMatch = rawJDText.match(/(\d+)\+?\s*(?:years|yrs)/i);

  // Responsibilities
  const respLines = rawJDText.split('\n')
    .map(l => l.trim())
    .filter(l => l.match(/^[•·–—-]\s/) || l.match(/^\d+[.)]\s/))
    .map(l => l.replace(/^[•·–—-\d.)]\s*/, '').trim())
    .filter(l => l.length > 10)
    .slice(0, 8);

  return {
    jobTitle,
    criticalSkills,
    secondarySkills,
    requiredExperienceYears: yearsMatch ? parseInt(yearsMatch[1]) : null,
    primaryResponsibilities: respLines.length ? respLines : ['Build and maintain software systems']
  };
};

module.exports = {
  extractStructuredResume,
  extractStructuredJD,
  extractPersonalInfo,
  extractSkills,
  extractExperience,
  extractEducation,
  extractProjects
};
