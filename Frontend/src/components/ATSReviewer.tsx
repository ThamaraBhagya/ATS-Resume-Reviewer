import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, CheckCircle, TrendingUp, Download, BarChart3, Shield, Target, Zap, Users, Star, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FileUpload } from './FileUpload';
import { ResultsDashboard } from './ResultsDashboard';

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

const ATSReviewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback((uploadedFile: File) => {
    setFile(uploadedFile);
    toast({
      title: "File uploaded successfully",
      description: `${uploadedFile.name} is ready for analysis.`,
    });
  }, [toast]);

  const analyzeResume = async () => {
  setIsAnalyzing(true);
  setProgress(0);

  const steps = [
    { progress: 20, message: "Uploading resume..." },
    { progress: 40, message: "Analyzing keywords..." },
    { progress: 60, message: "Checking ATS compatibility..." },
    { progress: 80, message: "Generating suggestions..." },
    { progress: 100, message: "Analysis complete!" }
  ];

  try {
    const formData = new FormData();
    formData.append('resume', file!);
    formData.append('jobDescription', jobDescription);

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
    }

    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    });

    if (response.status === 429) {
      toast({
        variant: "destructive",
        title: "Quota Exceeded",
        description: "API quota exceeded. Please try again later or check your OpenRouter plan.",
      });
      setIsAnalyzing(false);
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze resume');
    }

    const analysisResults: AnalysisResults = await response.json();
    setResults(analysisResults);
    setIsAnalyzing(false);

    toast({
      title: "Analysis Complete!",
      description: "Your resume has been analyzed successfully.",
    });
  } catch (error) {
    setIsAnalyzing(false);
    toast({
      variant: "destructive",
      title: "Analysis Failed",
      description: error instanceof Error ? error.message : "An error occurred during analysis.",
    });
  }
};

  const handleAnalyze = () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file uploaded",
        description: "Please upload your resume first.",
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Job description required",
        description: "Please paste the job description for better analysis.",
      });
      return;
    }

    analyzeResume();
  };

  const downloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Your ATS analysis report has been downloaded as PDF.",
    });
  };

  if (results) {
    return <ResultsDashboard results={results} onNewAnalysis={() => setResults(null)} onDownload={downloadReport} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl font-bold mb-6">
              Beat the ATS System
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Get your resume past Applicant Tracking Systems with our professional ATS compatibility checker. 
              Upload your resume and job description for instant, actionable feedback.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-hover transition-all duration-300"
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Upload className="mr-2 h-5 w-5" />
                Start Your ATS Check
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why ATS Optimization Matters</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Over 75% of resumes never reach human eyes. Applicant Tracking Systems filter out unoptimized resumes before recruiters see them.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 shadow-card bg-gradient-card text-center animate-fade-in">
              <Shield className="mx-auto h-16 w-16 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-4">ATS-Friendly Format</h3>
              <p className="text-muted-foreground">
                Ensure your resume uses the right format, fonts, and structure that ATS systems can easily parse and understand.
              </p>
            </Card>
            
            <Card className="p-8 shadow-card bg-gradient-card text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Target className="mx-auto h-16 w-16 text-secondary mb-6" />
              <h3 className="text-2xl font-bold mb-4">Keyword Optimization</h3>
              <p className="text-muted-foreground">
                Match your resume keywords with job descriptions to increase your chances of passing initial ATS screening.
              </p>
            </Card>
            
            <Card className="p-8 shadow-card bg-gradient-card text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Zap className="mx-auto h-16 w-16 text-accent mb-6" />
              <h3 className="text-2xl font-bold mb-4">Instant Analysis</h3>
              <p className="text-muted-foreground">
                Get real-time feedback on your resume's ATS compatibility score and detailed suggestions for improvement.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Our ATS Checker Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our advanced algorithm analyzes your resume against industry standards and specific job requirements.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h4 className="text-lg font-semibold mb-3">Upload Resume</h4>
              <p className="text-muted-foreground text-sm">
                Upload your resume in PDF or DOCX format for comprehensive analysis.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h4 className="text-lg font-semibold mb-3">Add Job Description</h4>
              <p className="text-muted-foreground text-sm">
                Paste the target job description for tailored keyword matching.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h4 className="text-lg font-semibold mb-3">AI Analysis</h4>
              <p className="text-muted-foreground text-sm">
                Our AI scans for ATS compatibility, keywords, and formatting issues.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
              <h4 className="text-lg font-semibold mb-3">Get Results</h4>
              <p className="text-muted-foreground text-sm">
                Receive detailed feedback and actionable suggestions for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Best Practices Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">ATS-Friendly Resume Best Practices</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Follow these essential guidelines to ensure your resume passes through Applicant Tracking Systems successfully.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Use Standard Section Headers</h4>
                      <p className="text-muted-foreground text-sm">
                        Stick to conventional headers like "Work Experience", "Education", "Skills" instead of creative alternatives.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Choose Simple, Clean Fonts</h4>
                      <p className="text-muted-foreground text-sm">
                        Use readable fonts like Arial, Calibri, or Times New Roman. Avoid decorative or script fonts.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Include Relevant Keywords</h4>
                      <p className="text-muted-foreground text-sm">
                        Mirror the language and keywords from the job description throughout your resume naturally.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Quantify Your Achievements</h4>
                      <p className="text-muted-foreground text-sm">
                        Use numbers, percentages, and specific metrics to demonstrate your impact and results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:pl-8">
                <Card className="p-8 shadow-card bg-gradient-card">
                  <div className="text-center mb-6">
                    <Star className="mx-auto h-12 w-12 text-accent mb-4" />
                    <h3 className="text-2xl font-bold">Ready to Optimize?</h3>
                    <p className="text-muted-foreground mt-2">
                      Upload your resume now and get instant ATS compatibility analysis with personalized recommendations.
                    </p>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-primary hover:shadow-hover text-lg py-6"
                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Check My Resume Now
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Job Seekers Worldwide</h2>
            <p className="text-xl text-white/90">
              Join thousands of professionals who have improved their resume's ATS compatibility
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">78%</div>
              <div className="text-white/80">Average ATS Score Improvement</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">92%</div>
              <div className="text-white/80">User Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Upload Section */}
        <div id="upload-section" className="max-w-4xl mx-auto">
          <Card className="p-8 shadow-card bg-gradient-card animate-slide-up">
            <div className="text-center mb-8">
              <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Upload Your Resume</h2>
              <p className="text-muted-foreground">
                Support for PDF and DOCX files only. Maximum file size: 10MB
              </p>
            </div>

            <FileUpload onFileUpload={handleFileUpload} />

            {file && (
              <div className="mt-6 p-4 bg-muted rounded-lg flex items-center animate-scale-in">
                <CheckCircle className="h-5 w-5 text-success mr-3" />
                <span className="font-medium">{file.name}</span>
                <span className="ml-auto text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
            )}
          </Card>

          {/* Job Description Input */}
          <Card className="p-8 shadow-card bg-gradient-card mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center mb-6">
              <BarChart3 className="mx-auto h-12 w-12 text-secondary mb-4" />
              <h2 className="text-3xl font-bold mb-4">Job Description</h2>
              <p className="text-muted-foreground">
                Paste the job description to get tailored keyword matching and optimization suggestions
              </p>
            </div>

            <Textarea
              placeholder="Paste the complete job description here for better analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-48 text-base resize-none"
            />
          </Card>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card className="p-8 shadow-card mt-8 animate-scale-in">
              <div className="text-center">
                <TrendingUp className="mx-auto h-12 w-12 text-primary mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold mb-4">Analyzing Your Resume</h3>
                <Progress value={progress} className="h-3 mb-4" />
                <p className="text-muted-foreground">
                  Please wait while we analyze your resume against the job requirements...
                </p>
              </div>
            </Card>
          )}

          {/* Analyze Button */}
          {!isAnalyzing && (
            <div className="text-center mt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                onClick={handleAnalyze}
                disabled={!file || !jobDescription.trim()}
                className="bg-gradient-primary hover:shadow-hover text-lg px-12 py-6 transition-all duration-300"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Analyze Resume
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">ATS Resume Reviewer</h3>
            <p className="text-muted-foreground mb-4">
              Professional resume optimization for modern job seekers
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 ATS Resume Reviewer. Built with React & TypeScript.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ATSReviewer;