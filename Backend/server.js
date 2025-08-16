require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');


const app = express();
const port = process.env.PORT || 5000;
let fetch;
import('node-fetch').then(module => {
  fetch = module.default;
}).catch(err => {
  console.error('Failed to import node-fetch:', err);
  process.exit(1);
});
// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.ATS_API;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Helper function to extract text from DOCX
async function extractTextFromDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// Retry function for API calls
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

// Route for analyzing resume
app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    // Validate input
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }
    if (!req.body.jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const filePath = path.join(__dirname, req.file.path);
    const fileType = req.file.mimetype;
    let resumeText = '';

    // Extract text based on file type
    if (fileType === 'application/pdf') {
      resumeText = await extractTextFromPDF(filePath);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword'
    ) {
      resumeText = await extractTextFromDOCX(filePath);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type. Only PDF and DOCX are allowed.' });
    }

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    const jobDescription = req.body.jobDescription;

    // Craft prompt for AI analysis
    const prompt = `
    You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume against the provided job description and return a comprehensive analysis in the exact JSON format specified below.

    RESUME TEXT:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    ANALYSIS INSTRUCTIONS:
    1. ATS SCORE (0-100): Calculate based on:
       - Format compliance (20% weight)
       - Keyword matching (30% weight)
       - Skill alignment (25% weight)
       - Experience relevance (25% weight)

    2. KEYWORD MATCH (%): Percentage of important job description keywords found in resume

    3. SKILL COVERAGE: Brief summary statement about skill alignment, need little bit explaind paragraph

    4. SKILLS ANALYSIS:
       - Present: List top 8 skills from resume that match job requirements
       - Missing: List top 5 skills from job description missing from resume

    5. KEYWORD ANALYSIS:
       - Critical: 5-8 must-have keywords from JD present in resume
       - Moderate: 5-8 nice-to-have keywords from JD present in resume
       - Missing: 5-8 important keywords from JD missing from resume
       - Density: Percentage of keywords matched (0-100)

    6. FORMATTING ANALYSIS:
       - Score (0-100) based on ATS-friendly formatting
       - Issues: List 3-5 formatting problems
       - Positives: List 3-5 formatting strengths

    7. EXPERIENCE ANALYSIS:
       - Relevance: Percentage (0-100) of experience matching job requirements
       - Gaps: List 2-3 experience gaps
       - Strengths: List 2-3 experience strengths

    8. ACHIEVEMENTS ANALYSIS:
       - Quantified: Count of achievements with metrics/numbers
       - Total: Total achievements listed
       - Suggestions: 2-3 ways to improve achievements

    9. COMPETITIVE ANALYSIS:
       - Ranking: Estimated percentile (e.g., "Top 20%")
       - Improvements: 3-5 key areas to improve competitiveness

    10. SUGGESTIONS: Provide 5 actionable improvement suggestions

    OUTPUT FORMAT (STRICT JSON ONLY - NO ADDITIONAL TEXT):
    {
      "atsScore": number,
      "keywordMatch": number,
      "skillCoverage": string,
      "suggestions": string[],
      "skills": {
        "present": string[],
        "missing": string[]
      },
      "keywordAnalysis": {
        "critical": string[],
        "moderate": string[],
        "missing": string[],
        "density": number
      },
      "formatting": {
        "score": number,
        "issues": string[],
        "positives": string[]
      },
      "experience": {
        "relevance": number,
        "gaps": string[],
        "strengths": string[]
      },
      "achievements": {
        "quantified": number,
        "total": number,
        "suggestions": string[]
      },
      "competitiveAnalysis": {
        "ranking": string,
        "improvements": string[]
      }
    }

    IMPORTANT: Return ONLY the JSON object with no additional text, explanations, or markdown formatting.
    `;


    // Call OpenRouter API
    const response = await withRetry(() => 
      fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5000',
          'X-Title': process.env.SITE_NAME || 'ATS Resume Reviewer'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo', // or any other supported model
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        })
      })
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to analyze resume');
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Unexpected response format from AI service');
    }

    const responseText = data.choices[0].message.content.trim();

    // Parse the JSON response
    let results;
    try {
      results = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return res.status(500).json({ error: 'Failed to parse analysis results' });
    }

    // Return the results
    res.json(results);
  } catch (error) {
    console.error('Error during analysis:', error);
    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
    }
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Debug route to verify environment variables
app.get('/check-env', (req, res) => {
  res.json({
    OPENROUTER_API_KEY: !!process.env.ATS_API,
    SITE_URL: process.env.SITE_URL,
    SITE_NAME: process.env.SITE_NAME,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});