import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Download
} from 'lucide-react';

interface AnalysisResults {
  atsScore: number;
  keywordMatch: number;
  skillCoverage: string;
  suggestions: string[];
  skills: {
    present: string[];
    missing: string[];
  };
  atsCompatibility: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  keywordAnalysis: {
    critical: string[];
    moderate: string[];
    missing: string[];
    density: number;
  };
  formatting: {
    score: number;
    issues: string[];
    positives: string[];
  };
  experience: {
    relevance: number;
    gaps: string[];
    strengths: string[];
  };
  achievements: {
    quantified: number;
    total: number;
    suggestions: string[];
  };
  competitiveAnalysis: {
    ranking: string;
    improvements: string[];
  };
}

const ATSImprovements = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results: AnalysisResults = location.state?.results;

  if (!results) {
    navigate('/');
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
              </Button>
              <div className="flex items-center space-x-4 mb-4">
                <Shield className="h-12 w-12 text-white" />
                <h1 className="text-4xl font-bold">ATS Compatibility Improvements</h1>
              </div>
              <p className="text-xl text-white/90">
                Detailed analysis and actionable steps to optimize your resume for Applicant Tracking Systems
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-hover"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ATSImprovements;