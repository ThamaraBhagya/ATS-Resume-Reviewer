import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';



interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const { toast } = useToast();
  // Add these states and effects to your FileUpload component:
const [uploadProgress, setUploadProgress] = useState(0);
const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload only PDF or DOCX files.",
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
      });
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileUpload(file);
      }
    }
  }, [onFileUpload, toast]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  if (files.length > 0) {
    const file = files[0];
    if (validateFile(file)) {
      setUploadStatus('uploading');
      
      // Simulate upload progress (replace with actual upload logic)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadStatus('success');
            onFileUpload(file);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }
  }, [onFileUpload, toast]);

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
        ${isDragActive 
          ? 'border-primary bg-primary/5 shadow-hover' 
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className={`transition-all duration-300 ${isDragActive ? 'scale-105' : ''}`}>
        <Upload className={`mx-auto h-16 w-16 mb-4 transition-colors duration-300 ${
          isDragActive ? 'text-primary' : 'text-muted-foreground'
        }`} />
        
        <h3 className="text-xl font-semibold mb-2">
          {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
        </h3>
        
        <p className="text-muted-foreground mb-4">
          Drag and drop your file here, or click to browse
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>PDF or DOCX only</span>
          <span>•</span>
          <span>Max 10MB</span>
        </div>
      </div>

      {isDragActive && (
        <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
          <div className="text-primary text-lg font-semibold">
            Drop to upload
          </div>
        </div>
      )}
    </div>
  );
};