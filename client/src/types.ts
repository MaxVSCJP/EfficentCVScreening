export interface ScreeningCriteria {
  title: string;
  description: string;
  skills: Record<string, number>;
  workExperienceYears: number | '';
  eduacationLevel: number;
  educationField: string;
  rankLimit: number; 
}

export interface Candidate {
  name: string;
  score: number;
  eduLevel: string;
  eduBackground: string;
  email?: string;
}