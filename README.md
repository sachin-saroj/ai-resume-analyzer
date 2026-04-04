# 🚀 AI Resume Analyzer PRO — Elite Career Intelligence

An enterprise-grade, locally-hosted platform that deeply parses your resume, cross-references it with target job descriptions, and provides actionable intelligence to boost your ATS compatibility and secure FAANG-tier interviews.

---

## 📸 Platform Showcase

### 1. The Dashboard (Instant Analysis)
Get a comprehensive 0-100 score, immediately identifying how well you map against your target role.
![Dashboard Hero](docs/screenshots/01_dashboard_hero.png)

### 2. Missing Skills & Priority Task Queue
Actionable steps categorized by severity (High/Medium/Low) highlighting exact technical or soft skills missing from your resume context.
![Score Analysis & Tasks](docs/screenshots/02_score_analysis.png)

### 3. Competency Matrix & Salary Intel
A radar chart visualizing your strengths (Frontend vs Backend vs System Design) alongside a data-driven projected FAANG salary band based on your extracted seniority.
![Charts & Salary Analysis](docs/screenshots/03_charts_salary.png)

### 4. Advanced Keyword & Action Verb Tracking
Detects passive vs. strong action verbs to ensure your bullet points lead with impact. Also provides intelligent career trajectory recommendations.
![Skills & Action Verbs](docs/screenshots/04_skills_verbs.png)

### 5. Premium Dark Mode
Sleek, eye-protective dark mode available out of the box with dynamic theme switching.
![Dark Mode UI](docs/screenshots/05_dark_mode.png)

### 6. Version History & Score Deltas
Track your resume optimizations over time, seeing exactly how many score points you gained and what skills you successfully added to beat the ATS.
![Version History Engine](docs/screenshots/06_version_history.png)

---

## ✨ Features

- **Advanced PDF Parsing:** Utilizes robust buffer-level extraction with dynamic fallbacks to perfectly read highly complex PDF layouts.
- **Real-time Gap Analysis:** Instantly diffs your current resume against provided job descriptions.
- **Grammar & Action Verb NLP:** Scans for weak verbs (e.g., "helped with", "worked on") and suggests commanding alternatives (e.g., "Architected", "Spearheaded").
- **Offline-First Architecture:** While it features a fully-fledged MongoDB backend, the core engine degrades gracefully, retaining results in-memory securely if external DBs are unreachable.
- **Beautiful, Responsive UI:** Built with standard React, styled perfectly with TailwindCSS, and integrated with smooth CSS fade-in animations for flawless data rendering.
- **Gamified Progression:** Earn "Career Points" and level up your strategy with dynamic progress tracking.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (v4)
- Recharts (Data Visualization)
- Lucide React (Icons)
- Context API (State Management)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- `pdf-parse` (v2 API for high-accuracy text extraction)
- Multer (in-memory file handling)
- Zod (Type-safe input validation)

---

## ⚡ Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a web cluster URI)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/SUMMcmap-pro.git
cd "SUMMcmap-pro/AI Resume Analyzer PRO"

# Install all dependencies (Client + Server concurrently)
npm run install-all
```

### 2. Environment Configuration
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/resume-analyzer
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### 3. Run the Platform
You can start both the frontend and backend with a single command from the root folder:
```bash
npm run dev
```

The application will spin up at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🐛 Recent Patches & Stability Improvements
- **PDF Extraction Engine Migration:** Transitioned entirely from deprecated v1 `pdf-parse` callbacks to stable v2 Class-based extraction (`new PDFParse({ data: buffer })`).
- **Render Stability Matrix:** Replaced unstable JS-based layout sizing with deterministic CSS keyframes, resolving prior Recharts dimension collapse warnings.
- **Bulletproof Global Error Boundries:** Integrated React boundary wrapping to prevent the "White Screen of Death", allowing smooth state recoveries across the entire app.

---

*Built for Engineers, by Engineers. Dominate the ATS.*
