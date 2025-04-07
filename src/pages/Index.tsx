
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FileUploader from "@/components/FileUploader";
import PersonalityResult from "@/components/PersonalityResult";
import { analyzeHandwriting, generateCareerAnalysis } from "@/services/handwritingAnalysis";
import { Brain, Loader2, PenTool } from "lucide-react";

const Index = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [personalityTrait, setPersonalityTrait] = useState<string | null>(null);
  const [handwritingTraits, setHandwritingTraits] = useState<Record<string, string> | null>(null);
  const [careerAnalysis, setCareerAnalysis] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    setAnalyzing(true);
    try {
      // Reset previous results
      setPersonalityTrait(null);
      setHandwritingTraits(null);
      setCareerAnalysis(null);
      
      // Analyze handwriting
      const result = await analyzeHandwriting(file);
      setPersonalityTrait(result.personalityTrait);
      setHandwritingTraits(result.handwritingTraits);
      
      // Generate career analysis
      const analysis = generateCareerAnalysis(result.personalityTrait, result.handwritingTraits);
      setCareerAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing handwriting:", error);
    } finally {
      setAnalyzing(false);
    }
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
                <div className="bg-secondary/50 p-4 rounded-lg text-center">
                  <h3 className="font-medium mb-2">Upload</h3>
                  <p className="text-sm">Submit an image of your handwriting</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg text-center">
                  <h3 className="font-medium mb-2">Analyze</h3>
                  <p className="text-sm">Our system examines your writing style</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg text-center">
                  <h3 className="font-medium mb-2">Discover</h3>
                  <p className="text-sm">Receive personalized career insights</p>
                </div>
              </div>
              <Separator className="my-6" />
              <FileUploader onFileSelected={handleFileSelected} />
            </CardContent>
          </Card>

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
            <PersonalityResult
              personalityTrait={personalityTrait}
              handwritingTraits={handwritingTraits}
              careerAnalysis={careerAnalysis}
            />
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
