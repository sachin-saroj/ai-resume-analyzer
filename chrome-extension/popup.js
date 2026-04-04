// Popup script for AI Resume Analyzer PRO Chrome Extension
document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Extracting job description from page...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_JD' }, (response) => {
      if (response && response.jobDescription) {
        status.textContent = `Extracted ${response.jobDescription.length} characters. Open dashboard to analyze.`;
        chrome.storage.local.set({ lastExtractedJD: response.jobDescription });
      } else {
        status.textContent = 'Could not extract JD from this page. Try a job listing page.';
      }
    });
  } catch (err) {
    status.textContent = 'Error: ' + err.message;
  }
});

document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:5173' });
});
