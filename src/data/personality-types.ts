
export interface PersonalityType {
  name: string;
  description: string;
  strengths: string[];
  careers: string[];
  workStyle: string;
}

export const personalityTypes: Record<string, PersonalityType> = {
  "Agreeableness": {
    name: "Agreeableness",
    description: "Cooperative, empathetic, and nurturing; values harmony in relationships.",
    strengths: ["Teamwork", "Empathy", "Conflict resolution", "Patient listening", "Support"],
    careers: ["Counselor", "HR Professional", "Social Worker", "Teacher", "Healthcare Provider", "Customer Service"],
    workStyle: "Thrives in collaborative environments with positive team dynamics and opportunities to help others."
  },
  "Conscientiousness": {
    name: "Conscientiousness",
    description: "Organized, detail-oriented, reliable; thrives on structure and planning.",
    strengths: ["Organization", "Reliability", "Attention to detail", "Goal-setting", "Persistence"],
    careers: ["Project Manager", "Financial Analyst", "Editor", "Quality Control Specialist", "Research Scientist", "Accountant"],
    workStyle: "Excels with clear objectives, structured environments, and roles requiring precision and follow-through."
  },
  "Extraversion": {
    name: "Extraversion",
    description: "Outgoing, energetic, people-oriented; draws energy from social interaction.",
    strengths: ["Communication", "Networking", "Persuasion", "Enthusiasm", "Leadership"],
    careers: ["Sales Professional", "Public Relations", "Event Planner", "Politics", "Marketing", "Performance Arts"],
    workStyle: "Flourishes in dynamic environments with frequent human interaction, variety, and opportunities to lead."
  },
  "Neuroticism": {
    name: "Neuroticism",
    description: "Emotionally sensitive, introspective; may excel in deeply analytical or empathetic roles.",
    strengths: ["Attention to risk", "Emotional awareness", "Thoughtful analysis", "Perfectionism", "Anticipating challenges"],
    careers: ["Creative Writer", "Artist", "Researcher", "Psychologist", "Quality Assurance", "Safety Coordinator"],
    workStyle: "Benefits from supportive environments with moderate stress levels, clear expectations, and appreciation for detail."
  },
  "Openness": {
    name: "Openness",
    description: "Imaginative, curious, intellectually driven; embraces innovation and creativity.",
    strengths: ["Innovation", "Adaptability", "Conceptual thinking", "Artistic expression", "Learning agility"],
    careers: ["Designer", "Researcher", "Entrepreneur", "Consultant", "Artist", "Professor", "Writer"],
    workStyle: "Thrives in environments that reward creativity, intellectual exploration, and novel approaches to problems."
  }
};
