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
              
              <div className="flex items-center space-x-4 mb-4">
                <Target className="h-12 w-12 text-white" />
                <h1 className="text-4xl font-bold">Job Alignment Strategies</h1>
              </div>
              <p className="text-xl text-white/90">
                Specific recommendations to better align your resume with this job opportunity
              </p>
            </div>
           
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
  {/* Job Fit Score - Modern Card */}
  <Card className="p-8 bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100 rounded-xl shadow-sm transition transform duration-300 hover:scale-101 hover:shadow-xl">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-lg bg-blue-100/50">
          <BarChart2 className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Job Fit Score</h2>
          <p className="text-gray-600">
            How well your resume matches the job requirements (1-10 scale)
          </p>
        </div>
      </div>
      <div className="text-center">
        <div className={`text-5xl font-bold ${getScoreColor(alignmentData.jobFit.score)}`}>
          {alignmentData.jobFit.score}<span className="text-2xl text-gray-500">/10</span>
        </div>
        <Badge 
          variant={alignmentData.jobFit.score >= 8 ? 'default' : 
                  alignmentData.jobFit.score >= 5 ? 'secondary' : 'destructive'}
          className="mt-2 text-sm px-3 py-1"
        >
          {getScoreBadge(alignmentData.jobFit.score)}
        </Badge>
      </div>
    </div>
  </Card>

  {/* Key Matches & Gaps - Split Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
    {/* Matches Card */}
    <Card className="p-6 border border-green-100 bg-green-50/30 rounded-xl transition transform duration-300 hover:scale-101 hover:shadow-xl">
      <div className="flex items-center space-x-3 mb-5">
        <div className="p-2 rounded-lg bg-green-100">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Strong Matches</h3>
      </div>
      <ul className="space-y-3">
        {alignmentData.jobFit.matches.map((match, index) => (
          <li key={index} className="flex items-start group">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 mr-3 mt-0.5">
              <CheckCircle className="h-4 w-4" />
            </span>
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              {match}
            </span>
          </li>
        ))}
      </ul>
    </Card>

    {/* Gaps Card */}
    <Card className="p-6 border border-amber-100 bg-amber-50/30 rounded-xl transition transform duration-300 hover:scale-101 hover:shadow-xl">
      <div className="flex items-center space-x-3 mb-5">
        <div className="p-2 rounded-lg bg-amber-100">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Key Gaps</h3>
      </div>
      <ul className="space-y-3">
        {alignmentData.jobFit.gaps.map((gap, index) => (
          <li key={index} className="flex items-start group">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-100 text-amber-600 mr-3 mt-0.5">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              {gap}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  </div>

  {/* Tailoring Recommendations - Modern Accordion Style */}
  <Card className="p-6 border border-gray-200 rounded-xl shadow-sm transition transform duration-300 hover:scale-101 hover:shadow-xl hover:shadow-indigo-500/35">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 rounded-lg bg-blue-100">
        <Lightbulb className="h-5 w-5 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Tailoring Recommendations</h2>
    </div>

    {/* Rewrites */}
    <div className="mb-8">
      <div className="flex items-center mb-4 px-2 py-3 bg-gray-50 rounded-lg">
        <FileText className="h-5 w-5 text-gray-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-800">Section Rewrites</h3>
      </div>
      <div className="space-y-4">
        {alignmentData.tailoring.rewrites.map((rewrite, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
            <h4 className="font-medium text-gray-800 mb-3">{rewrite.section}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">CURRENT</div>
                <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-300 text-gray-700">
                  {rewrite.before}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">SUGGESTED</div>
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400 text-gray-800">
                  {rewrite.after}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Additions */}
    <div className="mb-8">
      <div className="flex items-center mb-4 px-2 py-3 bg-gray-50 rounded-lg">
        <Zap className="h-5 w-5 text-green-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-800">Recommended Additions</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alignmentData.tailoring.additions.map((addition, index) => (
          <div key={index} className="p-4 border border-green-100 rounded-lg bg-green-50/30">
            <h4 className="font-medium text-gray-800 mb-2">{addition.item}</h4>
            <div className="text-sm text-gray-600 bg-white p-2 rounded border border-green-100">
              <span className="font-medium text-gray-500">Example:</span> {addition.example}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Removals */}
    <div>
      <div className="flex items-center mb-4 px-2 py-3 bg-gray-50 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-amber-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-800">Suggested Removals</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alignmentData.tailoring.removals.map((removal, index) => (
          <div key={index} className="p-4 border border-amber-100 rounded-lg bg-amber-50/30">
            <h4 className="font-medium text-gray-800 mb-1">{removal.item}</h4>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-500">Reason:</span> {removal.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>

  {/* Keyword Optimization - Modern Panel */}
  <Card className="p-6 border border-gray-200 rounded-xl shadow-sm transition transform duration-300 hover:scale-101 hover:shadow-xl hover:shadow-indigo-500/35">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 rounded-lg bg-purple-100">
        <ListChecks className="h-5 w-5 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Keyword Optimization</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Missing Keywords */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center mb-3">
          <Search className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-800">Missing Keywords</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {alignmentData.keywords.missing.map((keyword, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      {/* Placement Suggestions */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center mb-3">
          <LayoutTemplate className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-800">Placement Suggestions</h3>
        </div>
        <div className="space-y-2">
          {alignmentData.keywords.placement.map((placement, index) => (
            <div key={index} className="text-sm flex items-start">
              <span className="font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded mr-2">
                {placement.keyword}
              </span>
              <span className="text-gray-700 mt-1">→ {placement.section}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Examples */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center mb-3">
          <FileText className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="font-semibold text-gray-800">Usage Examples</h3>
        </div>
        <div className="space-y-2">
          {alignmentData.keywords.examples.map((example, index) => (
            <div 
              key={index} 
              className="text-sm p-3 bg-gray-50 rounded border-l-4 border-blue-300 italic text-gray-700"
            >
              "{example}"
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>

  {/* Achievement Enhancement */}
  <Card className="p-6 border border-gray-200 rounded-xl shadow-sm transition transform duration-300 hover:scale-101 hover:shadow-xl hover:shadow-indigo-500/35">
    <div className="flex items-center space-x-3 mb-6">
      <div className="p-2 rounded-lg bg-indigo-100">
        <Award className="h-5 w-5 text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Achievement Enhancement</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Achievements */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Strong Achievements</h3>
        <ul className="space-y-3">
          {alignmentData.achievements.current.map((achievement, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 mr-3 mt-0.5">
                <Star className="h-4 w-4" />
              </span>
              <span className="text-gray-700">{achievement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Achievements */}
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Suggested New Achievements</h3>
        <div className="space-y-3">
          {alignmentData.achievements.suggested.map((suggestion, index) => (
            <div key={index} className="p-3 border border-blue-100 rounded-lg bg-blue-50/30">
              <div className="font-medium text-gray-800 mb-1">Suggestion:</div>
              <div className="text-gray-600 text-sm mb-2">{suggestion.statement}</div>
              <div className="font-medium text-gray-800 mb-1">Example:</div>
              <div className="text-gray-700 text-sm">{suggestion.example}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Quantification Tips */}
    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantification Tips</h3>
      <ul className="space-y-2">
        {alignmentData.achievements.quantificationTips.map((tip, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-3 mt-0.5">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span className="text-gray-700">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  </Card>

  {/* Action Buttons - Centered with spacing */}
  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
   <Button
  size="lg"
  onClick={() => navigate(-1)}
  className="text-white shadow-sm rounded-xl px-6 py-3 
             bg-gradient-hero
             hover:scale-105 hover:shadow-lg 
             transition transform duration-300"
>
  <ArrowLeft className="mr-2 h-4 w-4" />
  Back to Results
</Button>

<Button
  size="lg"
  className="text-white shadow-sm rounded-xl px-6 py-3
             bg-gradient-hero
             hover:scale-105 hover:shadow-lg
             transition transform duration-300"
>
  <Download className="mr-2 h-4 w-4" />
  Download Full Report
</Button>


  </div>
</div>
    </div>
  );
};

export default JobAlignment;