import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Clock,
  Lightbulb,
  Zap,
  Download,
  TrendingUp
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

const JobAlignment = () => {
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
                <Target className="h-12 w-12 text-white" />
                <h1 className="text-4xl font-bold">Job Alignment Strategies</h1>
              </div>
              <p className="text-xl text-white/90">
                Specific recommendations to better align your resume with this job opportunity
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
        {/* Experience Relevance Overview */}
        <Card className="p-8 shadow-card bg-gradient-card mb-8 animate-scale-in">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Experience Relevance Score</h2>
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(results.experience.relevance)}`}>
              {results.experience.relevance}%
            </div>
            <p className="text-muted-foreground mb-4">
              How well your experience matches this job opportunity
            </p>
            <Progress value={results.experience.relevance} className="h-4 max-w-md mx-auto" />
          </div>
        </Card>

        {/* Experience Analysis */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Experience Strengths */}
          <Card className="p-8 shadow-card animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <Star className="h-8 w-8 text-success" />
              <h3 className="text-2xl font-bold text-success">Experience Strengths</h3>
            </div>
            <div className="space-y-4">
              {results.experience.strengths.map((strength, index) => (
                <div key={index} className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-success text-success-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-semibold text-success mb-1">Strength #{index + 1}</h4>
                      <p className="text-sm">{strength}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Experience Gaps */}
          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-8 w-8 text-warning" />
              <h3 className="text-2xl font-bold text-warning">Experience Gaps</h3>
            </div>
            <div className="space-y-4">
              {results.experience.gaps.map((gap, index) => (
                <div key={index} className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-warning text-warning-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      !
                    </div>
                    <div>
                      <h4 className="font-semibold text-warning mb-1">Gap #{index + 1}</h4>
                      <p className="text-sm">{gap}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Consider highlighting transferable skills or relevant projects
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Achievement Impact Analysis */}
        <Card className="p-8 shadow-card animate-slide-up mb-12" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-8">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-bold">Achievement Impact Analysis</h3>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Stats */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-gradient-subtle">
                <div className="text-center">
                  <h4 className="font-semibold mb-4">Current Achievement Stats</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">{results.achievements.total}</div>
                      <div className="text-sm text-muted-foreground">Total Achievements</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">{results.achievements.quantified}</div>
                      <div className="text-sm text-muted-foreground">Quantified</div>
                    </div>
                    <Progress 
                      value={(results.achievements.quantified / results.achievements.total) * 100} 
                      className="h-3" 
                    />
                    <div className="text-sm text-muted-foreground">
                      {Math.round((results.achievements.quantified / results.achievements.total) * 100)}% Quantified
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Enhancement Suggestions */}
            <div className="lg:col-span-2">
              <h4 className="font-semibold mb-4 flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <span>Enhancement Suggestions</span>
              </h4>
              <div className="space-y-4">
                {results.achievements.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 bg-background rounded-lg border border-primary/20">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium text-primary mb-1">Enhancement #{index + 1}</h5>
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Competitive Position */}
        <Card className="p-8 shadow-card bg-gradient-primary text-white animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center space-x-3 mb-8">
            <Zap className="h-8 w-8 text-white" />
            <h3 className="text-2xl font-bold">Competitive Market Position</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Current Ranking */}
            <div className="text-center lg:text-left">
              <h4 className="font-semibold mb-4">Current Market Ranking</h4>
              <div className="inline-block bg-white/20 rounded-lg p-6">
                <div className="text-4xl font-bold mb-2">{results.competitiveAnalysis.ranking}</div>
                <div className="text-white/80">of candidates for this role</div>
              </div>
              <p className="text-white/90 mt-4">
                Based on our analysis of similar profiles in the market
              </p>
            </div>

            {/* Key Improvements */}
            <div>
              <h4 className="font-semibold mb-4">Key Improvements to Stand Out</h4>
              <div className="space-y-3">
                {results.competitiveAnalysis.improvements.map((improvement, index) => (
                  <div key={index} className="p-4 bg-white/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-white/30 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm text-white">{improvement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Items Summary */}
        <Card className="p-8 shadow-card bg-gradient-card mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-2xl font-bold mb-6">Next Steps Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h4 className="font-semibold mb-2">Address Experience Gaps</h4>
              <p className="text-sm text-muted-foreground">
                Highlight transferable skills and relevant projects to fill identified gaps
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h4 className="font-semibold mb-2">Quantify Achievements</h4>
              <p className="text-sm text-muted-foreground">
                Add specific numbers, percentages, and metrics to demonstrate impact
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h4 className="font-semibold mb-2">Competitive Positioning</h4>
              <p className="text-sm text-muted-foreground">
                Implement suggested improvements to stand out from other candidates
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JobAlignment;