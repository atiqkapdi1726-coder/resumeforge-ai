export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: Subscription;
  usage: Usage;
}

export interface Subscription {
  plan: 'free' | 'pro' | 'annual';
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate?: Date;
  endDate?: Date;
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
}

export interface Usage {
  resumesCreated: number;
  atsChecks: number;
  aiImprovements: number;
  pdfDownloads: number;
  lastUpdated: Date;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  createdAt: Date;
  updatedAt: Date;
  atsScore?: number;
  isPublic: boolean;
  shareId?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'other';
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface ATSAnalysis {
  id: string;
  resumeId: string;
  jobDescription: string;
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  formattingScore: number;
  recommendations: ATSRecommendation[];
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  analyzedAt: Date;
}

export interface ATSRecommendation {
  category: 'keyword' | 'skill' | 'experience' | 'education' | 'formatting' | 'content';
  priority: 'high' | 'medium' | 'low';
  message: string;
  suggestion: string;
}

export interface JobMatch {
  resumeId: string;
  jobDescription: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'minimal' | 'professional' | 'creative' | 'executive';
  isPremium: boolean;
  previewUrl: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: PlanLimits;
  isPopular?: boolean;
}

export interface PlanLimits {
  maxResumes: number;
  maxAtsChecks: number;
  maxAiImprovements: number;
  maxPdfDownloads: number;
  premiumTemplates: boolean;
  advancedAnalysis: boolean;
  coverLetters: boolean;
  jobMatching: boolean;
}
