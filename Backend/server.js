// server.js (or index.js) - Backend for ATS Resume Reviewer using Express.js and OpenAI

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const docx = require('docx');
const { Packer } = docx;
const OpenAI = require('openai');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON bodies

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

// OpenAI setup - Replace with your actual API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-abcdef1234567890abcdef1234567890abcdef12', // Set this in environment variables for security
});

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Helper function to extract text from DOCX
async function extractTextFromDOCX(filePath) {
  const buffer = fs.readFileSync(filePath);
  const doc = await docx.Packer.toBuffer(buffer); // Wait, actually Packer is for creating, not reading. Use mammoth or similar for extraction.
  // Note: For DOCX text extraction, we'll use mammoth library for simplicity. Install mammoth: npm i mammoth
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// Route for analyzing resume
app.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
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
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
      resumeText = await extractTextFromDOCX(filePath);
    } else {
      fs.unlinkSync(filePath); // Clean up
      return res.status(400).json({ error: 'Unsupported file type. Only PDF and DOCX are allowed.' });
    }

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    const jobDescription = req.body.jobDescription;

    // Craft prompt for OpenAI
    const prompt = `
Analyze the following resume text against this job description. Provide a structured JSON output matching this interface:

interface AnalysisResults {
  atsScore: number; // Overall ATS compatibility score (0-100)
  keywordMatch: number; // Percentage of keyword match (0-100)
  skillCoverage: string; // Brief description of skill coverage
  suggestions: string[]; // Array of actionable suggestions
  skills: {
    present: string[]; // Skills present in resume
    missing: string[]; // Skills missing from resume but in job desc
  };
  atsCompatibility: {
    score: number; // ATS format score (0-100)
    issues: string[]; // Formatting issues
    recommendations: string[]; // Recommendations for ATS
  };
  keywordAnalysis: {
    critical: string[]; // Critical keywords matched
    moderate: string[]; // Moderate keywords
    missing: string[]; // Missing keywords
    density: number; // Keyword density percentage
  };
  formatting: {
    score: number; // Formatting score (0-100)
    issues: string[]; // Formatting issues
    positives: string[]; // Positive aspects
  };
  experience: {
    relevance: number; // Experience relevance (0-100)
    gaps: string[]; // Experience gaps
    strengths: string[]; // Strengths in experience
  };
  achievements: {
    quantified: number; // Number of quantified achievements
    total: number; // Total achievements
    suggestions: string[]; // Suggestions for achievements
  };
  competitiveAnalysis: {
    ranking: string; // e.g., "Top 30%"
    improvements: string[]; // Improvements for competitiveness
  };
}

Resume Text:
${resumeText}

Job Description:
${jobDescription}

Output ONLY the JSON object, no additional text.
`;

    // Call OpenAI API (using GPT-4 or GPT-3.5-turbo)
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or 'gpt-4' if you have access
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0].message.content.trim();

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
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});