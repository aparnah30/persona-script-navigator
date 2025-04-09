
export const handwritingCharacteristics = {
  letterSize: ["Small Letters", "Average Letters", "Large Letters"],
  letterSlant: ["Left Slant", "Vertical Slant", "Right Slant"],
  penPressure: ["Light Pen Pressure", "Heavy Pen Pressure"],
  baseline: ["Straight Baseline", "Rising Baseline", "Falling Baseline", "Erratic Baseline"],
  wordSpacing: ["Close Spaced Words", "Far Spaced Words"]
};

// Function for handwriting analysis - calls the backend API
export async function analyzeHandwriting(image: File): Promise<{
  personalityTrait: string;
  handwritingTraits: Record<string, string>;
}> {
  try {
    // Create form data to send the image
    const formData = new FormData();
    formData.append('image', image);
    
    // Send image to backend API (replace with your actual API endpoint)
    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze handwriting');
    }
    
    const data = await response.json();
    
    return {
      personalityTrait: data.personalityTrait,
      handwritingTraits: {
        letterSize: data.letterSize,
        letterSlant: data.letterSlant,
        penPressure: data.penPressure,
        baseline: data.baseline,
        wordSpacing: data.wordSpacing
      }
    };
  } catch (error) {
    console.error("Error calling handwriting analysis API:", error);
    
    // Fallback to default values if API fails
    return {
      personalityTrait: "Openness",
      handwritingTraits: {
        letterSize: "Average Letters",
        letterSlant: "Vertical Slant",
        penPressure: "Medium Pen Pressure",
        baseline: "Straight Baseline",
        wordSpacing: "Average Word Spacing"
      }
    };
  }
}

export function generateCareerAnalysis(
  personalityTrait: string,
  handwritingTraits: Record<string, string>
): string {
  try {
    // This function will return the career analysis from the API
    // For now, just return a placeholder message until the API integration is complete
    return `Career analysis for ${personalityTrait} personality type with the following handwriting traits: 
    ${Object.entries(handwritingTraits).map(([key, value]) => `${key}: ${value}`).join(', ')}. 
    
    Powered by advanced Large Language Model (LLM) analysis, this AI-driven career recommendation integrates your handwriting characteristics with modern personality research to provide personalized insights.
    
    API integration for detailed LLM-based career analysis is pending. The full Mistral AI analysis will appear here once connected.`;
  } catch (error) {
    console.error("Error generating career analysis:", error);
    return "Unable to generate career analysis at this time.";
  }
}
