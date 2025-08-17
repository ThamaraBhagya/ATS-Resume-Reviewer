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

    const jobDescription = req.body.jobDescription
        .replace(/[^\w\s.,-]/g, ' ') // Clean special chars
        .replace(/\s+/g, ' ')        // Collapse whitespace
        .trim();

    // Craft prompt for AI analysis
    const analysisPrompt = `
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
      "resumeText": string, // Extracted resume text
       "jobDescriptionText": string // Original job description
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
          messages: [{ role: 'user', content: analysisPrompt }],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        })
      })
    );
    // Add this new endpoint to your server.js


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

app.post('/analyze-improvements', async (req, res) => {
  try {
    // Validate input
    if (!req.body.resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }
    if (!req.body.jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const resumeText = req.body.resumeText;
    const jobDescription = req.body.jobDescription;

    const improvementsPrompt = `
        You are an expert ATS (Applicant Tracking System) resume optimizer. Analyze the following resume and job description to provide detailed improvement recommendations in the exact JSON format specified below.

        RESUME TEXT:
        ${resumeText}

        JOB DESCRIPTION:
        ${jobDescription}

        ANALYSIS REQUIREMENTS:
        1. FORMATTING ISSUES:
          - List 5-7 specific formatting problems affecting ATS parsing
          - For each, provide: problem description and exact fix recommendation

        2. KEYWORD OPTIMIZATION:
          - List 3-5 most important missing keywords to add
          - Suggest specific sections/locations to add them
          - Provide natural-sounding examples

        3. SKILL PRESENTATION:
          - Identify 3-5 poorly presented skills that need enhancement
          - Provide improved phrasing examples for each

        4. EXPERIENCE IMPROVEMENTS:
          - List 3-5 weak experience bullet points
          - Provide quantifiable rewrite examples for each

        5. ACTION PLAN:
          - 3 Immediate fixes (can be done in <1 hour)
          - 3 Medium-term improvements (2-3 hours work)
          - 3 Long-term optimizations (requires more effort)

        OUTPUT FORMAT (STRICT JSON ONLY):
        {
          "formattingIssues": {
            "problems": string[],
            "fixes": string[]
          },
          "keywordOptimization": {
            "missingKeywords": string[],
            "placementSuggestions": string[],
            "examples": string[]
          },
          "skillPresentation": {
            "weakSkills": string[],
            "improvedExamples": string[]
          },
          "experienceImprovements": {
            "weakBullets": string[],
            "quantifiedExamples": string[]
          },
          "actionPlan": {
            "immediate": string[],
            "mediumTerm": string[],
            "longTerm": string[]
          }
        }

        Return ONLY the JSON object with no additional text or explanations.
        `;

    // Call OpenRouter with improvements prompt
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo', // or any other supported model
          messages: [{ role: 'user', content: improvementsPrompt }],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Unexpected response format from AI service');
    }

    const responseText = data.choices[0].message.content.trim();
    const results = JSON.parse(responseText);
    
    res.json(results);
    
  } catch (error) {
    console.error('Improvements analysis error:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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