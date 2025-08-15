import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  PieChart,
  FileText,
  Award,
  Zap,
  Users,
  Star,
  Brain,
  Clock,
  Shield,
  Lightbulb,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

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

interface ResultsDashboardProps {
  results: AnalysisResults;
  onNewAnalysis: () => void;
  onDownload: () => void;
}

const COLORS = {
  primary: 'hsl(224, 76%, 52%)',
  secondary: 'hsl(262, 52%, 47%)',
  success: 'hsl(142, 76%, 36%)',
  warning: 'hsl(38, 92%, 50%)',
  danger: 'hsl(0, 84%, 60%)'
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  results, 
  onNewAnalysis, 
  onDownload 
}) => {
  const navigate = useNavigate();
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const skillsData = [
    { name: 'Present Skills', value: results.skills.present.length, fill: COLORS.success },
    { name: 'Missing Skills', value: results.skills.missing.length, fill: COLORS.warning }
  ];

  const chartData = [
    { category: 'Present', count: results.skills.present.length },
    { category: 'Missing', count: results.skills.missing.length }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <Button 
                variant="outline" 
                onClick={onNewAnalysis}
                className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
              <h1 className="text-4xl font-bold mb-4">Analysis Results</h1>
              <p className="text-xl text-white/90">
                Your resume has been analyzed against the job requirements
              </p>
            </div>
            <Button 
              size="lg"
              onClick={onDownload}
              className="bg-white text-primary hover:bg-white/90 shadow-hover"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* ATS Score */}
          <Card className="p-8 text-center shadow-card bg-gradient-card animate-scale-in">
            <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">ATS Score</h3>
            <div className={`text-5xl font-bold mb-4 ${getScoreColor(results.atsScore)}`}>
              {results.atsScore}
            </div>
            <Badge variant={getScoreBadgeVariant(results.atsScore)} className="text-sm">
              {results.atsScore >= 80 ? 'Excellent' : results.atsScore >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </Card>

          {/* Keyword Match */}
          <Card className="p-8 text-center shadow-card bg-gradient-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <Target className="mx-auto h-12 w-12 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keyword Match</h3>
            <div className={`text-5xl font-bold mb-4 ${getScoreColor(results.keywordMatch)}`}>
              {results.keywordMatch}%
            </div>
            <Progress value={results.keywordMatch} className="h-3" />
          </Card>

          {/* Skill Coverage */}
          <Card className="p-8 text-center shadow-card bg-gradient-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">Skill Coverage</h3>
            <p className="text-muted-foreground text-sm">
              {results.skillCoverage}
            </p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Bar Chart */}
          <Card className="p-8 shadow-card animate-slide-up">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold">Skills Analysis</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart */}
          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center mb-6">
              <PieChart className="h-6 w-6 text-secondary mr-3" />
              <h3 className="text-xl font-semibold">Skills Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                <span className="text-sm">Present ({results.skills.present.length})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
                <span className="text-sm">Missing ({results.skills.missing.length})</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Skills Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Present Skills */}
          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center mb-6">
              <CheckCircle className="h-6 w-6 text-success mr-3" />
              <h3 className="text-xl font-semibold">Skills Found</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.skills.present.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-success/10 text-success border-success/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Missing Skills */}
          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-6 w-6 text-warning mr-3" />
              <h3 className="text-xl font-semibold">Missing Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.skills.missing.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* ATS Compatibility Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold">ATS Compatibility</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Compatibility Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(results.atsCompatibility.score)}`}>
                  {results.atsCompatibility.score}/100
                </span>
              </div>
              <Progress value={results.atsCompatibility.score} className="h-2" />
              <div className="space-y-2">
                <h4 className="font-medium text-destructive">Issues Found:</h4>
                {results.atsCompatibility.issues.map((issue, index) => (
                  <div key={index} className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center mb-6">
              <Brain className="h-6 w-6 text-secondary mr-3" />
              <h3 className="text-xl font-semibold">Keyword Optimization</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Keyword Density</span>
                <span className="text-lg font-semibold">{results.keywordAnalysis.density}%</span>
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-success mb-2">Critical Keywords Found:</h4>
                  <div className="flex flex-wrap gap-1">
                    {results.keywordAnalysis.critical.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-destructive mb-2">Missing Critical Keywords:</h4>
                  <div className="flex flex-wrap gap-1">
                    {results.keywordAnalysis.missing.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-xl font-semibold">Formatting Analysis</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Formatting Score</span>
                <span className={`text-xl font-bold ${getScoreColor(results.formatting.score)}`}>
                  {results.formatting.score}/100
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-success">Strengths:</h4>
                {results.formatting.positives.map((positive, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{positive}</span>
                  </div>
                ))}
              </div>
              {results.formatting.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-warning">Issues:</h4>
                  {results.formatting.issues.map((issue, index) => (
                    <div key={index} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-warning mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center mb-6">
              <Award className="h-6 w-6 text-success mr-3" />
              <h3 className="text-xl font-semibold">Experience Match</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Relevance Score</span>
                <span className={`text-xl font-bold ${getScoreColor(results.experience.relevance)}`}>
                  {results.experience.relevance}%
                </span>
              </div>
              <Progress value={results.experience.relevance} className="h-2" />
              <div className="space-y-2">
                <h4 className="font-medium text-success">Key Strengths:</h4>
                {results.experience.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start">
                    <Star className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{strength}</span>
                  </div>
                ))}
              </div>
              {results.experience.gaps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-warning">Experience Gaps:</h4>
                  {results.experience.gaps.map((gap, index) => (
                    <div key={index} className="flex items-start">
                      <Clock className="h-4 w-4 text-warning mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{gap}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-secondary mr-3" />
              <h3 className="text-xl font-semibold">Achievement Impact</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Achievements</span>
                  <span className="text-lg font-semibold">{results.achievements.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quantified</span>
                  <span className="text-lg font-semibold text-success">{results.achievements.quantified}</span>
                </div>
                <Progress 
                  value={(results.achievements.quantified / results.achievements.total) * 100} 
                  className="h-2" 
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Enhancement Suggestions:</h4>
                {results.achievements.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start">
                    <Lightbulb className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Competitive Analysis */}
        <Card className="p-8 shadow-card animate-slide-up mb-12" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-secondary mr-3" />
            <h3 className="text-xl font-semibold">Competitive Analysis</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-3xl font-bold text-secondary mr-4">{results.competitiveAnalysis.ranking}</div>
                <div>
                  <div className="font-medium">Market Position</div>
                  <div className="text-sm text-muted-foreground">Compared to similar candidates</div>
                </div>
              </div>
              <p className="text-muted-foreground">
                Your resume ranks in the {results.competitiveAnalysis.ranking} of candidates for this role based on our analysis.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3">Key Competitive Improvements:</h4>
              <div className="space-y-2">
                {results.competitiveAnalysis.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start">
                    <Zap className="h-4 w-4 text-warning mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ATS Improvements Button */}
          <Card 
            className="p-8 shadow-card bg-gradient-card hover:shadow-hover transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/ats-improvements', { state: { results } })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">ATS Improvements</h3>
                  <p className="text-muted-foreground">
                    Detailed analysis and actionable steps to improve ATS compatibility
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Card>

          {/* Job Alignment Button */}
          <Card 
            className="p-8 shadow-card bg-gradient-card hover:shadow-hover transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/job-alignment', { state: { results } })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Target className="h-12 w-12 text-secondary group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">Job Alignment</h3>
                  <p className="text-muted-foreground">
                    Specific suggestions to better match this job opportunity
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};