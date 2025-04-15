
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { personalityTypes } from "@/data/personality-types";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";

interface PersonalityResultProps {
  personalityTrait: string;
  handwritingTraits: Record<string, string>;
  careerAnalysis: string;
  activeView: 'upload' | 'analyze' | 'discover';
}

const PersonalityResult: React.FC<PersonalityResultProps> = ({
  personalityTrait,
  handwritingTraits,
  careerAnalysis,
  activeView
}) => {
  const personality = personalityTypes[personalityTrait];

  if (!personality) {
    return null;
  }

  // Function to clean markdown formatting from LLM output
  const cleanLlmOutput = (text: string) => {
    return text
      .replace(/\*\*/g, '') // Remove bold syntax
      .replace(/##/g, '')   // Remove heading syntax
      .replace(/\n\n/g, '\n'); // Clean up double line breaks
  };

  return (
    <div className="w-full space-y-6 mt-8 result-appear">
      {/* Main personality card - shown in analyze view */}
      {activeView === 'analyze' && (
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader className="bg-secondary/50">
            <CardTitle className="text-2xl">
              Your Dominant Trait: {personality.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-lg mb-6">{personality.description}</p>
            
            <h3 className="text-lg font-medium mb-3">Key Strengths</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              {personality.strengths.map((strength) => (
                <div key={strength} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
            
            {/* Removed Potential Careers section from analyze view */}
            
            <h3 className="text-lg font-medium mb-2">Optimal Work Environment</h3>
            <p>{personality.workStyle}</p>
          </CardContent>
        </Card>
      )}

      {/* Handwriting analysis card - shown in analyze view */}
      {activeView === 'analyze' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Handwriting Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium">Letter Size</h3>
                <p className="text-sm bg-secondary rounded-lg p-2">{handwritingTraits.letterSize}</p>
                <h3 className="font-medium">Letter Slant</h3>
                <p className="text-sm bg-secondary rounded-lg p-2">{handwritingTraits.letterSlant}</p>
                <h3 className="font-medium">Pen Pressure</h3>
                <p className="text-sm bg-secondary rounded-lg p-2">{handwritingTraits.penPressure}</p>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Baseline</h3>
                <p className="text-sm bg-secondary rounded-lg p-2">{handwritingTraits.baseline}</p>
                <h3 className="font-medium">Word Spacing</h3>
                <p className="text-sm bg-secondary rounded-lg p-2">{handwritingTraits.wordSpacing}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Career analysis (LLM output) - shown in discover view */}
      {activeView === 'discover' && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Recommended Career Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-medium mb-3">Potential Careers</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {personality.careers.map((career) => (
                  <span
                    key={career}
                    className="px-3 py-1 bg-primary/10 text-primary-foreground rounded-full text-sm"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">AI-Powered Career Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="mb-4 text-sm text-muted-foreground">
                  Powered by advanced Mistral AI Large Language Model analysis
                </p>
                <div className="whitespace-pre-line">{cleanLlmOutput(careerAnalysis)}</div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PersonalityResult;
