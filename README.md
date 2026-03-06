# CVBoost - ATS Resume Analyzer

A full-stack web application that analyzes resumes against job descriptions using AI-powered insights. Get ATS compatibility scores, keyword matching, skill gap analysis, and actionable improvement recommendations.

---

## Features

- **Resume Upload** – PDF and DOCX file support
- **Job Description Analysis** – AI-powered resume matching
- **ATS Compatibility Score** – 0-100 scoring based on ATS compatibility
- **Keyword Analysis** – Matching, missing, and critical keywords
- **Skill Gap Detection** – Present vs. missing skills comparison
- **Job Alignment Recommendations** – Tailoring suggestions
- **PDF Report Export** – Download analysis reports
- **Real-time Progress Tracking** – Multi-stage analysis feedback

---

## Tech Stack

### Frontend
- **Vite** – Build tool and dev server
- **React 18** – UI library
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **React Router v6** – Routing
- **Shadcn/UI** – Component library
- **React Hook Form** – Form management
- **Recharts** – Data visualization
- **jsPDF & html2canvas** – PDF generation

### Backend
- **Node.js & Express 5.1** – Server framework
- **Groq API** –llama-3.3-70b  LLM integration for resume analysis


---

## Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- Groq API Key ([Get it here](https://console.groq.com))

### Installation

1. **Clone & Navigate**
   ```bash
   git clone <repo-url>
   cd cvboost
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   Create `.env`:
   ```env
   PORT=5000
   GROQ_API_KEY=your-groq-api-key
   NODE_ENV=development
   ```
   Start:
   ```bash
   node server.js
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```
   Create `.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
   Start:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### POST /analyze
Analyzes resume against job description
- **Input:** Resume file (PDF/DOCX) + job description text
- **Output:** ATS score, keyword match %, skills analysis, recommendations

### POST /analyze-improvements
Provides detailed improvement suggestions
- **Input:** Resume text + job description
- **Output:** Formatting issues, keyword optimization, action plan

### POST /analyze-job-alignment
Job-specific tailoring recommendations
- **Input:** Resume text + job description
- **Output:** Fit score, tailoring suggestions, keyword placement

---

## Technical Highlights

-  Multi-format document parsing (PDF & DOCX)
-  Advanced text normalization and cleaning
-  Groq LLM integration for intelligent analysis
-  Structured JSON responses with validation
-  Rate limiting and security middleware
-  Client-side PDF report generation
-  Responsive design with Tailwind CSS
-  Full TypeScript coverage
-  Error handling and retry logic
-  Memory-efficient file processing

---

## Project Structure

```
cvboost/
├── Backend/
│   ├── server.js              # Express server & API routes
│   ├── package.json
│   └── .env                   # Local environment config
│
├── Frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Route pages
│   │   ├── hooks/             # Custom hooks
│   │   └── App.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md
```

---

## License

MIT License
