import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress,  } from '@/components/ui/progress';

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
  TrendingUp,
  FileText,
  ListChecks,
  LayoutTemplate,
  BarChart2,
  Award,
  Search
} from 'lucide-react';

interface JobAlignmentData {
  jobFit: {
    score: number;
    matches: string[];
    gaps: string[];
  };
  tailoring: {
    rewrites: { section: string, before: string, after: string }[];
    additions: { item: string, example: string }[];
    removals: { item: string, reason: string }[];
  };
  keywords: {
    missing: string[];
    placement: { keyword: string, section: string }[];
    examples: string[];
  };
  achievements: {
    current: string[];
    suggested: { statement: string, example: string }[];
    quantificationTips: string[];
  };
  positioning: {
    summary: string;
    reordering: string[];
    emphasis: string[];
  };
}

const JobAlignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const alignmentData: JobAlignmentData = location.state?.alignmentData;

  if (!alignmentData) {
    navigate('/');
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 5) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) return 'Excellent Fit';
    if (score >= 5) return 'Moderate Fit';
    return 'Poor Fit';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              {/* <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
              </Button> */}
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

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Job Fit Score */}
        <Card className="p-8 shadow-card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <BarChart2 className="h-12 w-12 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Current Job Fit Score</h2>
                <p className="text-muted-foreground">
                  How well your resume matches the job requirements (1-10 scale)
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(alignmentData.jobFit.score)}`}>
                {alignmentData.jobFit.score}/10
              </div>
              <Badge variant={alignmentData.jobFit.score >= 8 ? 'default' : 
                             alignmentData.jobFit.score >= 5 ? 'secondary' : 'destructive'}>
                {getScoreBadge(alignmentData.jobFit.score)}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Key Matches & Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 shadow-card">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="h-6 w-6 text-success" />
              <h3 className="text-xl font-bold">Strong Matches</h3>
            </div>
            <ul className="space-y-4">
              {alignmentData.jobFit.matches.map((match, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block bg-success/10 text-success rounded-full p-1 mr-3">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  {match}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8 shadow-card">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-warning" />
              <h3 className="text-xl font-bold">Key Gaps</h3>
            </div>
            <ul className="space-y-4">
              {alignmentData.jobFit.gaps.map((gap, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block bg-warning/10 text-warning rounded-full p-1 mr-3">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  {gap}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Tailoring Recommendations */}
        <Card className="p-8 shadow-card">
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Tailoring Recommendations</h2>
          </div>

          <div className="space-y-8">
            {/* Rewrites */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Section Rewrites
              </h3>
              <div className="space-y-6">
                {alignmentData.tailoring.rewrites.map((rewrite, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <div className="font-semibold mb-2">{rewrite.section}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Current:</div>
                        <div className="p-3 bg-background rounded border border-destructive/20">
                          {rewrite.before}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Suggested:</div>
                        <div className="p-3 bg-background rounded border border-success/20">
                          {rewrite.after}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additions */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-success" />
                Recommended Additions
              </h3>
              <div className="space-y-4">
                {alignmentData.tailoring.additions.map((addition, index) => (
                  <div key={index} className="p-4 bg-success/5 rounded-lg border border-success/20">
                    <div className="font-semibold mb-2">{addition.item}</div>
                    <div className="text-muted-foreground">Example: {addition.example}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Removals */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                Suggested Removals
              </h3>
              <div className="space-y-4">
                {alignmentData.tailoring.removals.map((removal, index) => (
                  <div key={index} className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                    <div className="font-semibold mb-1">{removal.item}</div>
                    <div className="text-muted-foreground text-sm">Reason: {removal.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Keyword Optimization */}
        <Card className="p-8 shadow-card">
          <div className="flex items-center space-x-3 mb-6">
            <ListChecks className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold">Keyword Optimization</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {alignmentData.keywords.missing.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="bg-warning/10 text-warning">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <LayoutTemplate className="mr-2 h-4 w-4" />
                Placement Suggestions
              </h3>
              <div className="space-y-3">
                {alignmentData.keywords.placement.map((placement, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{placement.keyword}</span> → {placement.section}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Usage Examples
              </h3>
              <div className="space-y-3">
                {alignmentData.keywords.examples.map((example, index) => (
                  <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                    "{example}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Achievement Enhancement */}
        <Card className="p-8 shadow-card">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Achievement Enhancement</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Current Strong Achievements</h3>
              <ul className="space-y-4">
                {alignmentData.achievements.current.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block bg-success/10 text-success rounded-full p-1 mr-3">
                      <Star className="h-4 w-4" />
                    </span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Suggested New Achievements</h3>
              <div className="space-y-4">
                {alignmentData.achievements.suggested.map((suggestion, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <div className="font-semibold mb-1">Suggestion:</div>
                    <div className="text-muted-foreground mb-3">{suggestion.statement}</div>
                    <div className="font-semibold mb-1">Example:</div>
                    <div className="text-success">{suggestion.example}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Quantification Tips</h3>
            <ul className="space-y-3">
              {alignmentData.achievements.quantificationTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block bg-primary/10 text-primary rounded-full p-1 mr-3">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Strategic Positioning */}
        <Card className="p-8 shadow-card">
          <div className="flex items-center space-x-3 mb-6">
            <Lightbulb className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold">Strategic Positioning</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Summary/Objective Rewrite</h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="whitespace-pre-wrap">{alignmentData.positioning.summary}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Suggested Section Order</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {alignmentData.positioning.reordering.map((section, index) => (
                  <li key={index} className="font-medium">{section}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Elements to Emphasize</h3>
              <div className="flex flex-wrap gap-2">
                {alignmentData.positioning.emphasis.map((item, index) => (
                  <Badge key={index} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-8">
          <Button size="lg" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          <Button size="lg" variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download Full Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobAlignment;