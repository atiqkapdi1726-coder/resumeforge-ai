export const APP_CONFIG = {
  name: 'ResumeForge AI',
  tagline: 'Build a resume that gets noticed.',
  description: 'Create an ATS-friendly resume, tailor it to every job, and improve your application with AI-powered recommendations.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month' as const,
    features: [
      '1 resume',
      'Basic templates',
      'Limited ATS checks (3/month)',
      'Limited AI improvements (5/month)',
      'Limited PDF downloads (3/month)',
    ],
    limits: {
      maxResumes: 1,
      maxAtsChecks: 3,
      maxAiImprovements: 5,
      maxPdfDownloads: 3,
      premiumTemplates: false,
      advancedAnalysis: false,
      coverLetters: false,
      jobMatching: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    interval: 'month' as const,
    features: [
      'Unlimited resumes',
      'All templates',
      'Advanced ATS analysis',
      'Job matching',
      'AI resume rewriting',
      'AI tailoring',
      'Cover letters',
      'Unlimited PDF downloads',
      'Priority support',
    ],
    limits: {
      maxResumes: -1,
      maxAtsChecks: -1,
      maxAiImprovements: -1,
      maxPdfDownloads: -1,
      premiumTemplates: true,
      advancedAnalysis: true,
      coverLetters: true,
      jobMatching: true,
    },
    isPopular: true,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: 999,
    interval: 'year' as const,
    features: [
      'Everything in Pro',
      'Save ₹1,389/year',
      'Early access to new features',
      'Priority support',
    ],
    limits: {
      maxResumes: -1,
      maxAtsChecks: -1,
      maxAiImprovements: -1,
      maxPdfDownloads: -1,
      premiumTemplates: true,
      advancedAnalysis: true,
      coverLetters: true,
      jobMatching: true,
    },
  },
] as const;

export const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, modern design with subtle colors',
    category: 'modern' as const,
    isPremium: false,
    previewUrl: '/templates/modern.svg',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, professional layout',
    category: 'classic' as const,
    isPremium: false,
    previewUrl: '/templates/classic.svg',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple, elegant design',
    category: 'minimal' as const,
    isPremium: false,
    previewUrl: '/templates/minimal.svg',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'ATS-optimized professional format',
    category: 'professional' as const,
    isPremium: true,
    previewUrl: '/templates/professional.svg',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Eye-catching creative design',
    category: 'creative' as const,
    isPremium: true,
    previewUrl: '/templates/creative.svg',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Executive-level professional design',
    category: 'executive' as const,
    isPremium: true,
    previewUrl: '/templates/executive.svg',
  },
] as const;

export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  RESUMES: 'resumes',
  ATS_ANALYSES: 'atsAnalyses',
  COVER_LETTERS: 'coverLetters',
  SUBSCRIPTIONS: 'subscriptions',
  USAGE: 'usage',
} as const;

export const USAGE_LIMITS = {
  free: {
    maxResumes: 1,
    maxAtsChecks: 3,
    maxAiImprovements: 5,
    maxPdfDownloads: 3,
  },
  pro: {
    maxResumes: -1,
    maxAtsChecks: -1,
    maxAiImprovements: -1,
    maxPdfDownloads: -1,
  },
  annual: {
    maxResumes: -1,
    maxAtsChecks: -1,
    maxAiImprovements: -1,
    maxPdfDownloads: -1,
  },
} as const;
