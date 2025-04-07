
export const handwritingCharacteristics = {
  letterSize: ["Small Letters", "Average Letters", "Large Letters"],
  letterSlant: ["Left Slant", "Vertical Slant", "Right Slant"],
  penPressure: ["Light Pen Pressure", "Heavy Pen Pressure"],
  baseline: ["Straight Baseline", "Rising Baseline", "Falling Baseline", "Erratic Baseline"],
  wordSpacing: ["Close Spaced Words", "Far Spaced Words"]
};

// Function for handwriting analysis
export async function analyzeHandwriting(image: File): Promise<{
  personalityTrait: string;
  handwritingTraits: Record<string, string>;
}> {
  return new Promise((resolve) => {
    // Processing time
    setTimeout(() => {
      // Get a random personality trait
      const traits = ["Agreeableness", "Conscientiousness", "Extraversion", "Neuroticism", "Openness"];
      const randomTrait = traits[Math.floor(Math.random() * traits.length)];
      
      // Generate handwriting characteristics
      const handwritingTraits = {
        letterSize: handwritingCharacteristics.letterSize[
          Math.floor(Math.random() * handwritingCharacteristics.letterSize.length)
        ],
        letterSlant: handwritingCharacteristics.letterSlant[
          Math.floor(Math.random() * handwritingCharacteristics.letterSlant.length)
        ],
        penPressure: handwritingCharacteristics.penPressure[
          Math.floor(Math.random() * handwritingCharacteristics.penPressure.length)
        ],
        baseline: handwritingCharacteristics.baseline[
          Math.floor(Math.random() * handwritingCharacteristics.baseline.length)
        ],
        wordSpacing: handwritingCharacteristics.wordSpacing[
          Math.floor(Math.random() * handwritingCharacteristics.wordSpacing.length)
        ]
      };

      resolve({
        personalityTrait: randomTrait,
        handwritingTraits,
      });
    }, 2000);
  });
}

export function generateCareerAnalysis(
  personalityTrait: string,
  handwritingTraits: Record<string, string>
): string {
  const traitDescriptions = {
    letterSize: {
      "Small Letters": "indicates attention to detail and focus",
      "Average Letters": "shows balanced energy and adaptability",
      "Large Letters": "suggests confidence and outgoing nature"
    },
    letterSlant: {
      "Left Slant": "indicates reservation and self-control",
      "Vertical Slant": "suggests logical thinking and emotional balance",
      "Right Slant": "demonstrates responsiveness and social engagement"
    },
    penPressure: {
      "Light Pen Pressure": "reveals sensitivity and adaptability",
      "Heavy Pen Pressure": "indicates energy, commitment and conviction"
    },
    baseline: {
      "Straight Baseline": "demonstrates reliability and structured thinking",
      "Rising Baseline": "shows optimism and ambition",
      "Falling Baseline": "may indicate fatigue or pessimism",
      "Erratic Baseline": "suggests unpredictability and varied energy levels"
    },
    wordSpacing: {
      "Close Spaced Words": "indicates focused thinking and efficiency",
      "Far Spaced Words": "suggests expansive thinking and need for personal space"
    }
  };

  const analysisIntros = [
    "Your handwriting reveals fascinating insights about your personality and career potential.",
    "The analysis of your handwriting sample provides valuable clues about your professional strengths.",
    "Your handwriting characteristics combine with your personality profile to suggest promising career directions."
  ];

  const randomIntro = analysisIntros[Math.floor(Math.random() * analysisIntros.length)];
  let analysis = `${randomIntro}\n\nYour dominant personality trait is **${personalityTrait}**, which is reinforced by several elements in your handwriting:\n\n`;

  // Add analysis for each handwriting trait
  Object.entries(handwritingTraits).forEach(([trait, value]) => {
    const description = traitDescriptions[trait as keyof typeof traitDescriptions][value as keyof typeof traitDescriptions[keyof typeof traitDescriptions]];
    analysis += `- Your **${value}** ${description}.\n`;
  });

  analysis += `\nBased on your ${personalityTrait} personality and handwriting style, you may excel in roles that require `;

  // Add trait-specific career advice
  switch (personalityTrait) {
    case "Agreeableness":
      analysis += "empathy, cooperation, and supportive communication. Consider careers in counseling, healthcare, education, or human resources where your natural tendency to prioritize harmony and helping others will be valuable assets.";
      break;
    case "Conscientiousness":
      analysis += "organization, attention to detail, and follow-through. Explore careers in project management, accounting, quality control, or research where your methodical approach and reliability will be highly valued.";
      break;
    case "Extraversion":
      analysis += "social interaction, enthusiasm, and persuasion. Look into careers in sales, marketing, public relations, or leadership roles where your energy and people skills can shine.";
      break;
    case "Neuroticism":
      analysis += "emotional depth, attention to detail, and risk awareness. Consider careers in creative fields, quality assurance, research, or roles requiring vigilance and thoroughness.";
      break;
    case "Openness":
      analysis += "creativity, innovation, and intellectual exploration. Pursue careers in design, research and development, entrepreneurship, or artistic fields where your imagination and curiosity will be assets.";
      break;
  }

  return analysis;
}
