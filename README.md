# ATS Resume Receiver

ATS Resume Receiver is a web application designed to help users upload their resumes and instantly match them against a provided job description. It leverages OpenAI-powered analysis to generate ATS (Applicant Tracking System) scores, keyword matches, alignment suggestions, and actionable feedback to improve both resumes and job fit. The platform features a modern frontend built with Vite, Tailwind CSS, and TypeScript, and a robust backend using Express.js.

---

## Features

- **Resume Upload:** Easily upload resumes in PDF or DOCX formats.
- **Job Description Input:** Paste or upload the target job description for tailored analysis.
- **OpenAI-Powered Analysis:** Advanced resume parsing and comparison with job descriptions.
- **ATS Score:** Get a score indicating how well your resume passes automated tracking systems.
- **Keyword Matches:** See which keywords from the job description are present or missing in your resume.
- **ATS Improvement Suggestions:** Get a checklist of ways to improve your resume for ATS compatibility.
- **Job Alignment Details:** Insights on how well your experience and skills align with the role.
- **Downloadable Reports:** Export detailed analysis reports for offline review or sharing.
- **Modern UI:** Fast and responsive interface with Vite + Tailwind CSS + TypeScript.
- **Backend API:** Node.js Express REST API for secure file handling and AI analysis.

---

## Screenshots

<!-- Optionally include screenshots here -->

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [OpenAI API Key](https://platform.openai.com/signup) (for resume/job analysis)

---

### Clone the Repository

```bash
git clone https://github.com/ThamaraBhagya/ats-resume-receiver.git
cd ats-resume-receiver
```

---

### Setup Backend

1. Move into the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on the provided `.env.example`:
   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   node server.js
   # or
   yarn dev
   ```

   The backend will run at [http://localhost:5000](http://localhost:5000).

---

### Setup Frontend

1. Move into the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure the frontend to point to your backend API if needed (see `.env.example`).

4. Start the frontend development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will run at [http://localhost:5173](http://localhost:5173) by default.

---

## Usage

1. **Open the App:** Go to the frontend URL.
2. **Upload Resume:** Click ‘Upload Resume’ and select your file.
3. **Add Job Description:** Paste or upload the job description.
4. **Analyze:** Click ‘Analyze’ to let the system process your resume.
5. **View Results:** See your ATS score, keyword matches, improvement suggestions, and job alignment details.
6. **Download Report:** Export the analysis as a PDF for your records.

---

## Project Structure

```
ats-resume-receiver/
├── backend/           # Express server, OpenAI integration
│   ├── src/
│   └── ...
├── frontend/          # Vite + React + Tailwind CSS + TypeScript
│   ├── src/
│   └── ...
└── README.md
```

---

## Customization

- **OpenAI Model:** The backend uses OpenAI’s API for text analysis. You can configure the model or prompt logic in the backend code.
- **Styling:** The UI is styled with Tailwind CSS—customize via the `tailwind.config.js`.
- **Report Format:** You can adjust the downloadable report layout in the frontend source.

---

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---



## Contact

For questions, suggestions, or support, please open an issue or email [your-email@example.com](mailto:thamarabhagya755@example.com).

---

**ATS Resume Receiver** – Score, match, and align your resume with your dream job!
