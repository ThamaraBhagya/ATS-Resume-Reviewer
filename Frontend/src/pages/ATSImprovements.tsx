import React,{ useEffect,useState }  from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ATSImprovementsPdf } from '@/components/ATSImprovementsPdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
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
  const [isLoading, setIsLoading] = useState(true);
   useEffect(() => {
    if (!location.state?.improvements) {
      navigate('/',{ replace: true }); // Redirect if no data
    }else {
      setIsLoading(false);
    }
  }, [location.state, navigate]);

  const improvements = location.state?.improvements as ImprovementData;
  const results = location.state?.results; 

  if (!improvements) {
    return null; // Temporary render while redirecting
  }
  // Add this inside your ATSImprovements component:



  const handleBackToResults = () => {
    if (results) {
      navigate('/results', {
        state: { results },
        replace: false
      });
    } else {
      navigate('/', { replace: true }); // Fallback to home
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              
              <div className="flex items-center space-x-4 mb-4">
                <Shield className="h-12 w-12 text-white" />
                <h1 className="text-4xl font-bold">ATS Compatibility Improvements</h1>
              </div>
              <p className="text-xl text-white/90">
                Detailed analysis and actionable steps to optimize your resume for Applicant Tracking Systems
              </p>
            </div>
           
          </div>
        </div>
      </div>

     <div className="container mx-auto px-4 py-12 space-y-12">
                {/* Formatting Issues Section */}
                <Card className="p-8 border-blue-500  shadow-lg rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/20 mr-4">
                      <LayoutTemplate className="h-6 w-6 text-red-500 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Formatting Issues</h2>
                  </div>
                  <div className="space-y-4">
                    {improvements.formattingIssues.problems.map((problem, i) => (
                      <div key={i} className="p-5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center text-red-500 dark:text-red-400 mb-3">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          <span className="font-semibold">Issue</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 pl-7">{problem}</p>
                        <div className="flex items-center text-green-500 dark:text-green-400">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Fix:</span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 pl-7">{improvements.formattingIssues.fixes[i]}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Keyword Optimization Section */}
                <Card className="p-8 border-blue-500  shadow-lg rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 mr-4">
                      <Search className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Keyword Optimization</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {improvements.keywordOptimization.missingKeywords.map((keyword, i) => (
                      <div key={i} className="p-5 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center mb-3">
                          <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="font-medium">Add keyword:</span>
                          <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {keyword}
                          </Badge>
                        </div>
                        <div className="flex items-start mb-2 text-gray-600 dark:text-gray-400">
                          <FileText className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Where to add: {improvements.keywordOptimization.placementSuggestions[i]}</span>
                        </div>
                        <div className="flex items-start text-green-500 dark:text-green-400">
                          <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Example: {improvements.keywordOptimization.examples[i]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Skill Presentation Section */}
                <Card className="p-8 border-blue-500 shadow-lg rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 mr-4">
                      <ListChecks className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skill Presentation</h2>
                  </div>
                  <div className="space-y-4">
                    {improvements.skillPresentation.weakSkills.map((skill, i) => (
                      <div key={i} className="p-5 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center text-red-500 dark:text-red-400 mb-3">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          <span className="font-semibold">Weak Presentation</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 pl-7">{skill}</p>
                        <div className="flex items-center text-green-500 dark:text-green-400">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="font-medium">Improved Version:</span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 pl-7">{improvements.skillPresentation.improvedExamples[i]}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Experience Improvements Section */}
                <Card className="p-8 border-blue-500 shadow-lg rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 mr-4">
                      <TrendingUp className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience Improvements</h2>
                  </div>
                  <div className="space-y-6">
                    {improvements.experienceImprovements.weakBullets.map((bullet, i) => (
                      <div key={i} className="p-5 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                        <div className="text-red-500 dark:text-red-400 font-semibold mb-2">Weak Bullet Point:</div>
                        <p className="mb-4 italic text-gray-600 dark:text-gray-400">"{bullet}"</p>
                        <div className="text-green-500 dark:text-green-400 font-semibold mb-1">Improved Version:</div>
                        <p className="text-gray-800 dark:text-gray-200">"{improvements.experienceImprovements.quantifiedExamples[i]}"</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Action Plan Section */}
                <Card className="p-8 border-blue-500 shadow-lg rounded-xl bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-900/20 mr-4">
                      <Calendar className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Improvement Action Plan</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Immediate Fixes */}
                    <div className="p-6 rounded-xl border border-green-100 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10">
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mr-3">
                          <Zap className="h-5 w-5 text-green-500 dark:text-green-400" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Immediate Fixes</h3>
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-300 mb-4">Can be done in &lt;1 hour</div>
                      <ul className="space-y-3">
                        {improvements.actionPlan.immediate.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 mr-3 mt-0.5">
                              <CheckCircle className="h-4 w-4" />
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Medium Term */}
                    <div className="p-6 rounded-xl border border-yellow-100 dark:border-yellow-900/50 bg-yellow-50/50 dark:bg-yellow-900/10">
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-3">
                          <Clock className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Medium Term</h3>
                      </div>
                      <div className="text-sm text-yellow-600 dark:text-yellow-300 mb-4">2-3 hours work</div>
                      <ul className="space-y-3">
                        {improvements.actionPlan.mediumTerm.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 dark:text-yellow-400 mr-3 mt-0.5">
                              <CheckCircle className="h-4 w-4" />
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Long Term */}
                    <div className="p-6 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                          <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Long Term</h3>
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-300 mb-4">Requires more effort</div>
                      <ul className="space-y-3">
                        {improvements.actionPlan.longTerm.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 mr-3 mt-0.5">
                              <CheckCircle className="h-4 w-4" />
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
        </div>
      
        <div className="flex justify-center gap-4 pt-8 mb-5">
                  <Button size="lg" onClick={handleBackToResults}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Results
                  </Button>
                  <PDFDownloadLink 
  document={<ATSImprovementsPdf improvements={improvements} />}
  fileName="ATS-Improvements-Report.pdf"
>
  {({ loading }) => (
    <Button size="lg" variant="secondary" disabled={loading}>
      <Download className="mr-2 h-4 w-4" />
      {loading ? 'Preparing report...' : 'Download Full Report'}
    </Button>
  )}
</PDFDownloadLink>
                </div>
      </div>
    
  );
};

export default ATSImprovements;