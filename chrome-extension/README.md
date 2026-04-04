# Chrome Extension — AI Resume Analyzer PRO

## Overview
This folder contains the Chrome Extension scaffolding for the AI Resume Analyzer PRO platform.

The extension enables users to:
- Scrape job descriptions from LinkedIn, Indeed, and Glassdoor
- Send them directly to the analysis dashboard
- Get instant ATS compatibility insights

## Setup (Development)
1. Open `chrome://extensions/` in Chrome
2. Enable "Developer mode"
3. Click "Load unpacked" and select this `chrome-extension/` folder
4. The extension icon will appear in the toolbar

## Files
- `manifest.json` — Chrome Extension manifest (MV3)
- `popup.html/js` — Extension popup UI
- `content.js` — Content script for JD extraction
- `background.js` — Background service worker
- `icons/` — Extension icons (to be added)

## Note
This is a scaffold preparation. Icon files (`icons/icon16.png`, `icon48.png`, `icon128.png`) need to be created before the extension can be loaded.
