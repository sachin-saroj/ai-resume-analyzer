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

// Load saved connection settings on load
const dashboardUrlInput = document.getElementById('dashboardUrlInput');
chrome.storage.local.get(['dashboardUrl'], (res) => {
  if (res.dashboardUrl) {
    dashboardUrlInput.value = res.dashboardUrl;
  }
});

// Save connection settings on input change
dashboardUrlInput.addEventListener('input', (e) => {
  chrome.storage.local.set({ dashboardUrl: e.target.value });
});

// Toggle connection settings visibility
document.getElementById('toggleSettings').addEventListener('click', () => {
  const settingsSection = document.getElementById('settingsSection');
  settingsSection.style.display = settingsSection.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.storage.local.get(['dashboardUrl'], (res) => {
    const url = res.dashboardUrl || 'http://localhost:5173';
    chrome.tabs.create({ url });
  });
});
