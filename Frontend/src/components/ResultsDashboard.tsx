import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
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
  ArrowRight,
  Search
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
  resumeText?: string;
  jobDescriptionText?: string;
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
   const { toast } = useToast(); 
  // Add these state variables
  // 3. Fixed handleShowImprovements function
  const handleShowImprovements = async () => {
    try {
      if (!results.resumeText || !results.jobDescriptionText) {
        toast({
          variant: "destructive",
          title: "Data missing",
          description: "Resume text or job description not available",
        });
        return;
      }
      const cleanJobDescription = results.jobDescriptionText
      .replace(/\s+/g, ' ')          // Replace multiple spaces
      .replace(/[^\w\s.,-]/g, ' ')   // Keep only common punctuation
      .trim();

      const response = await fetch('http://localhost:5000/analyze-improvements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: results.resumeText,
          jobDescription: cleanJobDescription
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch improvements');
      }
      
      const improvements = await response.json();
      navigate('/ats-improvements', { 
      state: { improvements,results},
       
      // Add this to prevent navigation loops
    });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load improvements",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };
  const handleShowJobAlignment = async () => {
  try {
    if (!results.resumeText || !results.jobDescriptionText) {
      toast({
        variant: "destructive",
        title: "Data missing",
        description: "Resume text or job description not available",
      });
      return;
    }
    const cleanJobDescription = results.jobDescriptionText
      .replace(/\s+/g, ' ')          // Replace multiple spaces
      .replace(/[^\w\s.,-]/g, ' ')   // Keep only common punctuation
      .trim();

    const response = await fetch('http://localhost:5000/analyze-job-alignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText: results.resumeText,
        jobDescription: cleanJobDescription
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch job alignment analysis');
    }

    const alignmentData = await response.json();
    navigate('/job-alignment', {
      state: { alignmentData }
    });

  } catch (error) {
    toast({
      variant: "destructive",
      title: "Analysis Failed",
      description: error instanceof Error ? error.message : "Failed to analyze job alignment",
    });
  }
};
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
            
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* ATS Score */}
          <Card className="p-8 text-center shadow-card bg-gradient-card animate-scale-in transition transform duration-300 hover:scale-101 hover:shadow-xl">
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
          <Card className="p-8 text-center shadow-card bg-gradient-card animate-scale-in transition transform duration-300 hover:scale-101 hover:shadow-xl" style={{ animationDelay: '0.1s' }}>
            <Target className="mx-auto h-12 w-12 text-secondary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keyword Match</h3>
            <div className={`text-5xl font-bold mb-4 ${getScoreColor(results.keywordMatch)}`}>
              {results.keywordMatch}%
            </div>
            <Progress value={results.keywordMatch} className="h-3" />
          </Card>

          {/* Skill Coverage */}
          <Card className="p-8 text-center shadow-card bg-gradient-card animate-scale-in transition transform duration-300 hover:scale-101 hover:shadow-xl" style={{ animationDelay: '0.2s' }}>
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
          <Card className="p-8 shadow-card animate-slide-up transition transform duration-300 hover:scale-101 hover:shadow-xl">
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
          <Card className="p-8 shadow-card animate-slide-up transition transform duration-300 hover:scale-101 hover:shadow-xl" style={{ animationDelay: '0.1s' }}>
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
          <Card className="p-8 shadow-card animate-slide-up transition transform duration-300 hover:scale-101 hover:shadow-xl" style={{ animationDelay: '0.2s' }}>
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
          <Card className="p-8 shadow-card animate-slide-up transition transform duration-300 hover:scale-101 hover:shadow-xl" style={{ animationDelay: '0.3s' }}>
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

        

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ATS Improvements Button */}
          <Card 
            className="p-8 shadow-card bg-gradient-to-r from-cyan-500/20 to-blue-500/30  cursor-pointer group transition transform duration-300 hover:scale-103 hover:shadow-xl"
            onClick={handleShowImprovements }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Shield className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">ATS Improvements</h3>
                  <p className="text-bold">
                    Detailed analysis and actionable steps to improve ATS compatibility
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Card>

          {/* Job Alignment Button */}
          <Card 
            className="p-8 shadow-card bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-pink-500/50  cursor-pointer group transition transform duration-300 hover:scale-103 hover:shadow-xl"
            onClick={handleShowJobAlignment }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Target className="h-12 w-12 text-secondary group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">Job Alignment</h3>
                  <p className="text-bold">
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