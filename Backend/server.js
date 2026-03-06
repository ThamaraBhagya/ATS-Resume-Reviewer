require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
app.set("trust proxy", 1);

const port = process.env.PORT || 5000;

// Configuration for Groq
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use((req, res, next) => {
  if (req.url.includes('://')) { 
    return res.status(400).json({ error: "Invalid route path" });
  }
  next();
});

// Updated CORS to allow ANY local frontend during development
app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 
});
app.use(limiter);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper: Retry logic
async function withRetry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries} failed: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Helper: Standardized Groq AI Call
async function callGroq(prompt, maxTokens = 1500) {
  return await withRetry(async () => {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', 
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, 
        max_tokens: maxTokens,
        response_format: { type: "json_object" } 
      })
    });

    const data = await response.json();

    // Properly surface API errors instead of masking them
    if (!response.ok) {
      throw new Error(`Groq API Error: ${data.error?.message || response.statusText}`);
    }

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service');
    }

    
    let rawText = data.choices[0].message.content.trim();
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    return rawText;
  });
}

// Routes
app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No resume file uploaded' });
    if (!req.body.jobDescription) return res.status(400).json({ error: 'Job description is required' });

    const fileType = req.file.mimetype;
    const fileBuffer = req.file.buffer;
    let resumeText = '';

    try {
      if (fileType === 'application/pdf') {
        const data = await pdfParse(fileBuffer);
        resumeText = data.text;
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        resumeText = result.value;
      } else {
        return res.status(400).json({ error: 'Unsupported file type', supportedTypes: ['PDF', 'DOCX'] });
      }
    } catch (parseError) {
      return res.status(422).json({ error: 'Failed to parse resume', details: 'The file may be corrupted or password protected' });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(422).json({ error: 'Invalid resume content', details: 'The document appears to be empty or unreadable' });
    }

    const jobDescription = req.body.jobDescription
      .replace(/\r?\n|\t+/g, ' ').replace(/\s+/g, ' ')
      .replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, '-')
      .replace(/[^a-zA-Z0-9\s.,!?'"()\-\:+*\/&%@]/g, ' ')
      .replace(/\s+([.,!?'"()\-\:+*\/&%@])/g, '$1').trim();

    const analysisPrompt = `
    You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume against the provided job description and return a comprehensive analysis in the exact JSON format specified below.

    RESUME TEXT:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    ANALYSIS INSTRUCTIONS:
    1. ATS SCORE (0-100): Calculate based on: Format compliance (20%), Keyword matching (30%), Skill alignment (25%), Experience relevance (25%)
    2. KEYWORD MATCH (%): Percentage of important job description keywords found in resume
    3. SKILL COVERAGE: Brief summary statement about skill alignment, need little bit explaind paragraph
    4. SKILLS ANALYSIS: Present (top 8), Missing (top 5)

    OUTPUT FORMAT (STRICT JSON ONLY - NO ADDITIONAL TEXT):
    {
      "atsScore": 0,
      "keywordMatch": 0,
      "skillCoverage": "",
      "suggestions": [],
      "skills": { "present": [], "missing": [] }
    }
    `;

    const aiResponseText = await callGroq(analysisPrompt, 1300);
    const results = JSON.parse(aiResponseText);

    if (!results.atsScore || !results.skills) {
      throw new Error('Incomplete analysis results');
    }

    results.resumeText = resumeText;
    results.jobDescriptionText = jobDescription;

    res.json({ success: true, ...results });

  } catch (error) {
    console.error('Analysis error:', error);
    if (error.name === 'AbortError') return res.status(504).json({ error: 'Analysis timeout', solution: 'Please try again with a smaller file' });
    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return res.status(429).json({ error: 'API quota exceeded', solution: 'Please check your Groq API limits' });
    }
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

app.post('/analyze-improvements', async (req, res) => {
  try {
    if (!req.body.resumeText || !req.body.jobDescription) {
      return res.status(400).json({ error: 'Resume text and Job description are required' });
    }

    const improvementsPrompt = `
    You are an expert ATS (Applicant Tracking System) resume optimizer. Analyze the following resume and job description to provide detailed improvement recommendations in the exact JSON format specified below.

    RESUME TEXT:
    ${req.body.resumeText}

    JOB DESCRIPTION:
    ${req.body.jobDescription}

    ANALYSIS REQUIREMENTS:
    1. FORMATTING ISSUES: 5-7 problems with exact fix
    2. KEYWORD OPTIMIZATION: 3-5 missing keywords with placement examples
    3. SKILL PRESENTATION: 3-5 poorly presented skills with better phrasing
    4. EXPERIENCE IMPROVEMENTS: 3-5 weak bullets with quantified rewrites
    5. ACTION PLAN: 3 Immediate, 3 Medium-term, 3 Long-term

    OUTPUT FORMAT (STRICT JSON ONLY):
    {
      "formattingIssues": { "problems": [], "fixes": [] },
      "keywordOptimization": { "missingKeywords": [], "placementSuggestions": [], "examples": [] },
      "skillPresentation": { "weakSkills": [], "improvedExamples": [] },
      "experienceImprovements": { "weakBullets": [], "quantifiedExamples": [] },
      "actionPlan": { "immediate": [], "mediumTerm": [], "longTerm": [] }
    }
    `;

    const aiResponseText = await callGroq(improvementsPrompt, 1500);
    res.json(JSON.parse(aiResponseText));

  } catch (error) {
    console.error('Improvements analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/analyze-job-alignment', async (req, res) => {
  try {
    if (!req.body.resumeText || !req.body.jobDescription) {
      return res.status(400).json({ error: 'Resume text and Job description are required' });
    }

    const alignmentPrompt = `
    You are an expert career coach and resume strategist. Analyze how well the following resume aligns with the provided job description and provide specific, actionable recommendations. Return the analysis in the exact JSON format specified below.

    RESUME TEXT:
    ${req.body.resumeText}

    JOB DESCRIPTION:
    ${req.body.jobDescription}

    ANALYSIS REQUIREMENTS:
    1. JOB FIT ANALYSIS: Score (1-10), 3-5 matches, 3-5 gaps
    2. TAILORING RECOMMENDATIONS: 3-5 rewrites, 2-3 additions, 1-2 removals
    3. KEYWORD OPTIMIZATION: 5-7 missing, placement, examples
    4. ACHIEVEMENT ALIGNMENT: 2-3 current, 2-3 suggested, quantification tips
    5. STRATEGIC POSITIONING: Summary rewrite, reordering, emphasis

    OUTPUT FORMAT (STRICT JSON ONLY):
    {
      "jobFit": { "score": 0, "matches": [], "gaps": [] },
      "tailoring": { 
        "rewrites": [{ "section": "", "before": "", "after": "" }],
        "additions": [{ "item": "", "example": "" }],
        "removals": [{ "item": "", "reason": "" }]
      },
      "keywords": { "missing": [], "placement": [{ "keyword": "", "section": "" }], "examples": [] },
      "achievements": { "current": [], "suggested": [{ "statement": "", "example": "" }], "quantificationTips": [] },
      "positioning": { "summary": "", "reordering": [], "emphasis": [] }
    }
    `;

    const aiResponseText = await callGroq(alignmentPrompt, 1500);
    res.json(JSON.parse(aiResponseText));

  } catch (error) {
    console.error('Job alignment analysis error:', error);
    res.status(500).json({ error: error.message, solution: 'Please check your input and try again' });
  }
});

app.get('/check-env', (req, res) => {
  res.json({
    GROQ_API_KEY_EXISTS: !!process.env.GROQ_API_KEY,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));