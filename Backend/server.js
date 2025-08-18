require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');



app.use(limiter);

const app = express();
const port = process.env.PORT || 5000;
let fetch;
import('node-fetch').then(module => {
  fetch = module.default;
}).catch(err => {
  console.error('Failed to import node-fetch:', err);
  process.exit(1);
});
const allowedOrigins = [
  'https://cvboost-rho.vercel.app', // Your Vercel URL
  'http://localhost:3000'          // For local dev
];
 app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
// Middleware
//app.use(cors());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
// File upload configuration
//const upload = multer({ dest: 'uploads/' });
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory instead of disk
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
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
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

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

    
    const fileType = req.file.mimetype;
    const fileBuffer = req.file.buffer;
    let resumeText = '';

    // Extract text based on file type
    // if (fileType === 'application/pdf') {
    //   resumeText = await extractTextFromPDF(filePath);
    // } else if (
    //   fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    //   fileType === 'application/msword'
    // ) {
    //   resumeText = await extractTextFromDOCX(filePath);
    // } else {
    //   fs.unlinkSync(filePath);
    //   return res.status(400).json({ error: 'Unsupported file type. Only PDF and DOCX are allowed.' });
    // }
    try {
      if (fileType === 'application/pdf') {
        const data = await pdfParse(fileBuffer);
        resumeText = data.text;
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        resumeText = result.value;
      } else {
        return res.status(400).json({ 
          error: 'Unsupported file type',
          supportedTypes: ['PDF', 'DOCX']
        });
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      return res.status(422).json({ 
        error: 'Failed to parse resume',
        details: 'The file may be corrupted or password protected'
      });
    }
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(422).json({ 
        error: 'Invalid resume content',
        details: 'The document appears to be empty or unreadable'
      });
    }

    // Clean up the uploaded file
    // fs.unlinkSync(filePath);

    const jobDescription = req.body.jobDescription
        .replace(/\r?\n|\t+/g, ' ')                        // normalize newlines & tabs
          .replace(/\s+/g, ' ')                              // collapse multiple spaces
          .replace(/[“”]/g, '"')                             // normalize smart quotes
          .replace(/[‘’]/g, "'")                             // normalize apostrophes
          .replace(/[–—]/g, '-')                             // normalize dashes
          .replace(/[^a-zA-Z0-9\s.,!?'"()\-\:+*\/&%@]/g, ' ') // allow common symbols
          .replace(/\s+([.,!?'"()\-\:+*\/&%@])/g, '$1')      // remove space before punctuation
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
    // Validate response structure
    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service');
    }

    // Parse and validate JSON
    let results;
    try {
      results = JSON.parse(data.choices[0].message.content);
      
      if (!results.atsScore || !results.skills) {
        throw new Error('Incomplete analysis results');
      }
      
      // Add cleaned texts to response
      results.resumeText = resumeText;
      results.jobDescriptionText = jobDescription;

    } catch (parseError) {
      console.error('AI Response:', data.choices[0].message.content);
      throw new Error('Failed to parse analysis results');
    }

    // Return successful response
    res.json({
      success: true,
      ...results
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Special handling for timeout
    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        error: 'Analysis timeout',
        solution: 'Please try again with a smaller file'
      });
    }
    
    // Rate limit handling
    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return res.status(429).json({ 
        error: 'API quota exceeded',
        solution: 'Please try again later or upgrade your plan'
      });
    }
    
    // General error response
    res.status(500).json({
      error: 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      solution: 'Please check your input and try again'
    });
  }

  //   if (!response.ok) {
  //     throw new Error(data.error?.message || 'Failed to analyze resume');
  //   }

  //   if (!data.choices || !data.choices[0]?.message?.content) {
  //     throw new Error('Unexpected response format from AI service');
  //   }

  //   const responseText = data.choices[0].message.content.trim();

  //   // Parse the JSON response
  //   let results;
  //   try {
  //     results = JSON.parse(responseText);
  //   } catch (parseError) {
  //     console.error('Error parsing AI response:', parseError);
  //     return res.status(500).json({ error: 'Failed to parse analysis results' });
  //   }

  //   // Return the results
  //   res.json(results);
  // } catch (error) {
  //   console.error('Error during analysis:', error);
  //   if (error.message.includes('rate limit') || error.message.includes('quota')) {
  //     return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
  //   }
  //   res.status(500).json({ error: error.message || 'Internal server error' });
  // }
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
app.post('/analyze-job-alignment', async (req, res) => {
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

    const alignmentPrompt = `
    You are an expert career coach and resume strategist. Analyze how well the following resume aligns with the provided job description and provide specific, actionable recommendations to better tailor the resume for this position. Return the analysis in the exact JSON format specified below.

    RESUME TEXT:
    ${resumeText}

    JOB DESCRIPTION:
    ${jobDescription}

    ANALYSIS REQUIREMENTS:
    1. JOB FIT ANALYSIS:
       - Score (1-10): How well the resume currently matches the job requirements
       - Key matches: 3-5 strongest existing alignments
       - Key gaps: 3-5 most significant mismatches

    2. TAILORING RECOMMENDATIONS:
       - Rewrites: 3-5 specific resume sections to modify with before/after examples
       - Additions: 2-3 new elements to include (with examples)
       - Removals: 1-2 elements to remove (with justification)

    3. KEYWORD OPTIMIZATION:
       - Missing: 5-7 most important missing keywords from job description
       - Placement: Specific sections where they should be added
       - Examples: Natural-sounding examples of how to incorporate them

    4. ACHIEVEMENT ALIGNMENT:
       - Current: 2-3 existing achievements that best match job requirements
       - Suggested: 2-3 new achievement statements to add (with examples)
       - Quantification: How to better quantify existing achievements

    5. STRATEGIC POSITIONING:
       - Summary/Objective: Recommended rewrite to target this specific job
       - Reordering: Suggested section reorganization for better impact
       - Emphasis: Which aspects to highlight more prominently

    OUTPUT FORMAT (STRICT JSON ONLY):
    {
      "jobFit": {
        "score": number,
        "matches": string[],
        "gaps": string[]
      },
      "tailoring": {
        "rewrites": { section: string, before: string, after: string }[],
        "additions": { item: string, example: string }[],
        "removals": { item: string, reason: string }[]
      },
      "keywords": {
        "missing": string[],
        "placement": { keyword: string, section: string }[],
        "examples": string[]
      },
      "achievements": {
        "current": string[],
        "suggested": { statement: string, example: string }[],
        "quantificationTips": string[]
      },
      "positioning": {
        "summary": string,
        "reordering": string[],
        "emphasis": string[]
      }
    }

    IMPORTANT: Return ONLY the JSON object with no additional text or markdown formatting.
    `;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5000',
        'X-Title': process.env.SITE_NAME || 'ATS Resume Reviewer'
      },
       body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo', // or any other supported model
          messages: [{ role: 'user', content: alignmentPrompt }],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Unexpected response format from AI service');
    }

    // Parse and validate response
    const responseText = data.choices[0].message.content.trim();
    let results;
    try {
      results = JSON.parse(responseText);
      // Validate required fields
      if (!results.jobFit || !results.tailoring) {
        throw new Error('Invalid response structure from AI');
      }
    } catch (parseError) {
      console.error('Failed to parse:', responseText);
      throw new Error('Failed to parse analysis results');
    }
    
    res.json(results);
    
  } catch (error) {
    console.error('Job alignment analysis error:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      solution: 'Please check your input and try again'
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
// Add this after all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});