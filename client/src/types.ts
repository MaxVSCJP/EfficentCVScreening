export interface ScreeningCriteria {
  title: string;
  description: string;
  skills: Record<string, number>;
  workExperienceYears: number | '';
  eduacationLevel: number;
  educationField: string;
  candidateCount: number; 
}

export interface Candidate {
  name: string;
  email?: string;
  resumeUrl?: string;
  skillScore: number;
  workScore: number;
  educationScore: number;
  averageScore: number;
}