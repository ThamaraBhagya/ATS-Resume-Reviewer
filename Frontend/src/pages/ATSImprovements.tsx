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

      <div className="container mx-auto px-4 py-12">
        {/* ATS Score Overview */}
        <Card className="p-8 shadow-card bg-gradient-card mb-8 animate-scale-in">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Current ATS Compatibility Score</h2>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(results.atsCompatibility.score)}`}>
              {results.atsCompatibility.score}/100
            </div>
            <p className="text-muted-foreground">
              Your resume's ability to pass through Applicant Tracking Systems
            </p>
          </div>
        </Card>

        {/* Critical Issues & Recommendations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Critical Issues */}
          <Card className="p-8 shadow-card animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <h3 className="text-2xl font-bold text-destructive">Critical ATS Issues</h3>
            </div>
            <div className="space-y-4">
              {results.atsCompatibility.issues.map((issue, index) => (
                <div key={index} className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-destructive mb-1">Issue #{index + 1}</h4>
                      <p className="text-sm">{issue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Actions */}
          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
              <h3 className="text-2xl font-bold text-success">Recommended Actions</h3>
            </div>
            <div className="space-y-4">
              {results.atsCompatibility.recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-success text-success-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-success mb-1">Action #{index + 1}</h4>
                      <p className="text-sm">{rec}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Formatting Analysis */}
        <Card className="p-8 shadow-card animate-slide-up mb-12" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-8">
            <FileText className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold">Detailed Formatting Analysis</h3>
            <Badge className={`ml-auto ${getScoreColor(results.formatting.score)}`}>
              Score: {results.formatting.score}/100
            </Badge>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Issues Found */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <h4 className="text-xl font-semibold text-destructive">Issues Found</h4>
                <Badge variant="destructive">{results.formatting.issues.length}</Badge>
              </div>
              <div className="space-y-4">
                {results.formatting.issues.map((issue, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg border-l-4 border-destructive">
                    <div className="flex items-start space-x-3">
                      <span className="text-destructive text-xl font-bold">×</span>
                      <div>
                        <h5 className="font-medium text-destructive mb-1">Formatting Issue</h5>
                        <p className="text-sm text-muted-foreground">{issue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Good Elements */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <h4 className="text-xl font-semibold text-success">Good Elements</h4>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  {results.formatting.positives.length}
                </Badge>
              </div>
              <div className="space-y-4">
                {results.formatting.positives.map((positive, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg border-l-4 border-success">
                    <div className="flex items-start space-x-3">
                      <span className="text-success text-xl font-bold">✓</span>
                      <div>
                        <h5 className="font-medium text-success mb-1">Good Practice</h5>
                        <p className="text-sm text-muted-foreground">{positive}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Best Practices Guide */}
        <Card className="p-8 shadow-card bg-gradient-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-2xl font-bold mb-6">ATS-Friendly Resume Best Practices</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">File Format</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use .docx or .pdf formats</li>
                <li>• Avoid images and graphics</li>
                <li>• Keep file size under 1MB</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Content Structure</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use standard section headers</li>
                <li>• Include relevant keywords</li>
                <li>• Quantify achievements</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Formatting</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use simple, clean fonts</li>
                <li>• Avoid tables and columns</li>
                <li>• Use bullet points for lists</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ATSImprovements;