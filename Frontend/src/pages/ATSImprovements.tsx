import React,{ useEffect }  from 'react';
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
  Download,
  Zap,
  Clock,
  Calendar,
  LayoutTemplate,
  Type,
  ListChecks,
  Search,
  TrendingUp
} from 'lucide-react';

interface ImprovementData {
  formattingIssues: {
    problems: string[];
    fixes: string[];
  };
  keywordOptimization: {
    missingKeywords: string[];
    placementSuggestions: string[];
    examples: string[];
  };
  skillPresentation: {
    weakSkills: string[];
    improvedExamples: string[];
  };
  experienceImprovements: {
    weakBullets: string[];
    quantifiedExamples: string[];
  };
  actionPlan: {
    immediate: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
}

const ATSImprovements = () => {
  const navigate = useNavigate();
  const location = useLocation();
   useEffect(() => {
    if (!location.state?.improvements) {
      navigate('/'); // Redirect if no data
    }
  }, [location.state, navigate]);

  const improvements = location.state?.improvements as ImprovementData;

  if (!improvements) {
    return null; // Temporary render while redirecting
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
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
        {/* Formatting Issues Section */}
        <Card className="p-8 mb-12 shadow-card">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <LayoutTemplate className="mr-3 h-6 w-6 text-destructive" />
            Formatting Issues
          </h2>
          <div className="space-y-6">
            {improvements.formattingIssues.problems.map((problem, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold text-destructive mb-2 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Issue: {problem}
                </div>
                <div className="text-success flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Fix: {improvements.formattingIssues.fixes[i]}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Keyword Optimization Section */}
        <Card className="p-8 mb-12 shadow-card">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Search className="mr-3 h-6 w-6 text-primary" />
            Keyword Optimization
          </h2>
          <div className="space-y-6">
            {improvements.keywordOptimization.missingKeywords.map((keyword, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold mb-2 flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-warning" />
                  Add keyword: <Badge variant="outline" className="ml-2">{keyword}</Badge>
                </div>
                <div className="mb-2 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                  Where to add: {improvements.keywordOptimization.placementSuggestions[i]}
                </div>
                <div className="text-success flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Example: {improvements.keywordOptimization.examples[i]}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Skill Presentation Section */}
        <Card className="p-8 mb-12 shadow-card">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ListChecks className="mr-3 h-6 w-6 text-secondary" />
            Skill Presentation
          </h2>
          <div className="space-y-6">
            {improvements.skillPresentation.weakSkills.map((skill, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold text-destructive mb-2 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Weak Presentation: {skill}
                </div>
                <div className="text-success flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Improved Version: {improvements.skillPresentation.improvedExamples[i]}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Experience Improvements Section */}
        <Card className="p-8 mb-12 shadow-card">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="mr-3 h-6 w-6 text-primary" />
            Experience Improvements
          </h2>
          <div className="space-y-6">
            {improvements.experienceImprovements.weakBullets.map((bullet, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <div className="font-semibold text-destructive mb-2">Weak Bullet Point:</div>
                <p className="mb-3 italic text-muted-foreground">"{bullet}"</p>
                <div className="text-success">
                  <div className="font-semibold mb-1">Improved Version:</div>
                  <p>"{improvements.experienceImprovements.quantifiedExamples[i]}"</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Plan Section */}
        <Card className="p-8 shadow-card">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <Calendar className="mr-3 h-6 w-6 text-primary" />
            Improvement Action Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Immediate Fixes */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-success" />
                Immediate Fixes (1-2 days)
              </h3>
              <ul className="space-y-3">
                {improvements.actionPlan.immediate.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block bg-success/10 text-success rounded-full p-1 mr-3">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Medium Term */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Clock className="mr-2 h-5 w-5 text-warning" />
                Medium Term (1-2 weeks)
              </h3>
              <ul className="space-y-3">
                {improvements.actionPlan.mediumTerm.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block bg-warning/10 text-warning rounded-full p-1 mr-3">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Long Term */}
            <div className="border rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Long Term (1+ months)
              </h3>
              <ul className="space-y-3">
                {improvements.actionPlan.longTerm.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block bg-primary/10 text-primary rounded-full p-1 mr-3">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ATSImprovements;