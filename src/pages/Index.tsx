
import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; 
import FileUploader from "@/components/FileUploader";
import PersonalityResult from "@/components/PersonalityResult";
import { analyzeHandwriting, generateCareerAnalysis } from "@/services/handwritingAnalysis";
import { Brain, Loader2, PenTool, Upload, Search, Lightbulb } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [personalityTrait, setPersonalityTrait] = useState<string | null>(null);
  const [handwritingTraits, setHandwritingTraits] = useState<Record<string, string> | null>(null);
  const [careerAnalysis, setCareerAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'upload' | 'analyze' | 'discover'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (file: File) => {
    setUploadedFile(file);
    setError(null);
    // Reset previous results
    setPersonalityTrait(null);
    setHandwritingTraits(null);
    setCareerAnalysis(null);
    toast({
      title: "Image uploaded",
      description: "Click 'Analyze' to start handwriting analysis"
    });
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast({
        title: "No image",
        description: "Please upload a handwriting sample first.",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    setError(null);
    
    try {
      // Analyze handwriting
      const result = await analyzeHandwriting(uploadedFile);
      setPersonalityTrait(result.personalityTrait);
      setHandwritingTraits(result.handwritingTraits);
      
      // Get career analysis from the API response
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('image', uploadedFile);
          return formData;
        })(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get career analysis from API');
      }
      
      const data = await response.json();
      setCareerAnalysis(data.careerAnalysis);
      setActiveView('analyze');
      
    } catch (error) {
      console.error("Error analyzing handwriting:", error);
      setError("Failed to analyze handwriting. Please try again or check if the API server is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUploadClick = () => {
    setActiveView('upload');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAnalyzeClick = () => {
    handleAnalyze();
  };

  const handleDiscoverClick = () => {
    if (!careerAnalysis) {
      toast({
        title: "No career analysis available",
        description: "Please analyze a handwriting sample first.",
        variant: "destructive"
      });
      return;
    }
    setActiveView('discover');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-navy-800 to-navy-900 text-white py-6 px-4">
        <div className="container max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Brain className="w-8 h-8 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold">Handwriting Personality Analyzer</h1>
          </div>
          <div className="flex items-center text-sm opacity-80">
            <PenTool className="w-4 h-4 mr-2" />
            <span>Personality Insights Through Script Analysis</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-5xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 gap-8">
          {/* Introduction */}
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Discover Your Personality Profile</h2>
              <p className="text-muted-foreground mb-4">
                Upload a sample of your handwriting to uncover insights about your personality
                traits and receive personalized career guidance based on your unique characteristics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className={`flex flex-col h-auto py-4 gap-2 ${activeView === 'upload' ? 'border-2 border-primary rounded-md p-3' : ''}`}>
                  <div className="rounded-full bg-primary/10 p-4 self-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-center">Upload</h3>
                  <p className="text-sm font-normal text-center">Submit an image of your handwriting</p>
                </div>
                
                <Button 
                  onClick={handleAnalyzeClick}
                  variant={activeView === 'analyze' ? 'default' : 'outline'} 
                  className="flex flex-col h-auto py-4 gap-2"
                  disabled={!uploadedFile || analyzing}
                >
                  <Search className="w-6 h-6" />
                  <h3 className="font-medium">Analyze</h3>
                  <p className="text-sm font-normal">Our system examines your writing style</p>
                </Button>
                
                <Button 
                  onClick={handleDiscoverClick}
                  variant={activeView === 'discover' ? 'default' : 'outline'} 
                  className="flex flex-col h-auto py-4 gap-2"
                  disabled={!careerAnalysis}
                >
                  <Lightbulb className="w-6 h-6" />
                  <h3 className="font-medium">Discover</h3>
                  <p className="text-sm font-normal">Get LLM-powered career insights</p>
                </Button>
              </div>
              <Separator className="my-6" />
              
              <div className={activeView === 'upload' ? 'block' : 'hidden'}>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />
                <FileUploader onFileSelected={handleFileSelected} />
              </div>
            </CardContent>
          </Card>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Analysis loader */}
          {analyzing && (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-medium">Analyzing your handwriting...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          )}

          {/* Results section */}
          {personalityTrait && handwritingTraits && careerAnalysis && (
            <div className={activeView !== 'upload' ? 'block' : 'hidden'}>
              <PersonalityResult
                personalityTrait={personalityTrait}
                handwritingTraits={handwritingTraits}
                careerAnalysis={careerAnalysis}
                activeView={activeView}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-white/80 py-6 px-4">
        <div className="container max-w-5xl mx-auto text-center text-sm">
          <p>Handwriting Personality Analyzer</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
