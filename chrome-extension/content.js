// Content script — extracts job description text from supported job sites
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'EXTRACT_JD') {
    let jobDescription = '';

    // LinkedIn
    const linkedinJD = document.querySelector('.jobs-description__content, .description__text, [class*="job-description"]');
    if (linkedinJD) jobDescription = linkedinJD.innerText;

    // Indeed
    const indeedJD = document.querySelector('#jobDescriptionText, .jobsearch-jobDescriptionText');
    if (!jobDescription && indeedJD) jobDescription = indeedJD.innerText;

    // Glassdoor
    const glassdoorJD = document.querySelector('[class*="JobDesc"], .desc');
    if (!jobDescription && glassdoorJD) jobDescription = glassdoorJD.innerText;

    // Generic fallback
    if (!jobDescription) {
      const article = document.querySelector('article, main, [role="main"]');
      if (article) jobDescription = article.innerText.substring(0, 5000);
    }

    sendResponse({ jobDescription: jobDescription.trim() });
  }
});
