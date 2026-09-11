import { ATSAnalysis, ATSRecommendation, Resume } from '@/types';

export function analyzeATS(resume: Resume, jobDescription: string): ATSAnalysis {
  const jobKeywords = extractKeywords(jobDescription);
  const resumeText = resumeToText(resume);
  const resumeKeywords = extractKeywords(resumeText);

  const matchedKeywords = jobKeywords.filter((kw) =>
    resumeKeywords.some((rk) => rk.toLowerCase().includes(kw.toLowerCase()))
  );
  const missingKeywords = jobKeywords.filter(
    (kw) => !resumeKeywords.some((rk) => rk.toLowerCase().includes(kw.toLowerCase()))
  );

  const jobSkills = extractSkills(jobDescription);
  const resumeSkills = resume.skills.map((s) => s.name.toLowerCase());

  const matchedSkills = jobSkills.filter((js) =>
    resumeSkills.some((rs) => rs.includes(js.toLowerCase()))
  );
  const missingSkills = jobSkills.filter(
    (js) => !resumeSkills.some((rs) => rs.includes(js.toLowerCase()))
  );

  const keywordScore = calculateKeywordScore(matchedKeywords.length, jobKeywords.length);
  const skillsScore = calculateSkillsScore(matchedSkills.length, jobSkills.length);
  const experienceScore = calculateExperienceScore(resume, jobDescription);
  const educationScore = calculateEducationScore(resume, jobDescription);
  const formattingScore = calculateFormattingScore(resume);
  const completenessScore = calculateCompletenessScore(resume);
  const readabilityScore = calculateReadabilityScore(resume);
  const contactScore = calculateContactScore(resume);

  const overallScore = Math.round(
    keywordScore * 0.2 +
    skillsScore * 0.2 +
    experienceScore * 0.15 +
    educationScore * 0.1 +
    formattingScore * 0.15 +
    completenessScore * 0.1 +
    readabilityScore * 0.05 +
    contactScore * 0.05
  );

  const recommendations = generateRecommendations({
    keywordScore,
    skillsScore,
    experienceScore,
    educationScore,
    formattingScore,
    completenessScore,
    readabilityScore,
    contactScore,
    matchedKeywords,
    missingKeywords,
    matchedSkills,
    missingSkills,
    resume,
  });

  return {
    id: '',
    resumeId: resume.id,
    jobDescription,
    overallScore,
    keywordScore,
    skillsScore,
    experienceScore,
    educationScore,
    formattingScore,
    recommendations,
    matchedKeywords,
    missingKeywords,
    matchedSkills,
    missingSkills,
    analyzedAt: new Date(),
  };
}

const TECHNICAL_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin',
  'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt.js', 'node.js', 'express', 'django', 'flask', 'spring',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd', 'terraform', 'ansible',
  'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'dynamodb', 'firebase',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material-ui', 'styled-components',
  'agile', 'scrum', 'jira', 'confluence', 'figma', 'sketch', 'adobe xd',
  'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch',
  'rest api', 'graphql', 'microservices', 'serverless', 'kafka', 'rabbitmq',
  'linux', 'bash', 'powershell', 'nginx', 'apache',
  'photoshop', 'illustrator', 'indesign', 'premiere pro',
  'excel', 'powerpoint', 'word', 'google analytics', 'tableau', 'power bi',
  'blockchain', 'solidity', 'web3',
  'react native', 'flutter', 'ios', 'android',
];

const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking',
  'time management', 'project management', 'adaptability', 'creativity', 'analytical',
  'attention to detail', 'decision making', 'conflict resolution', 'mentoring',
];

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'shall', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 'just', 'because', 'as', 'until', 'while',
    'about', 'between', 'through', 'during', 'before', 'after', 'above',
    'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'also', 'any', 'if',
    'or', 'nor', 'our', 'my', 'your', 'his', 'her', 'its', 'their',
    'me', 'him', 'us', 'them', 'mine', 'yours', 'hers', 'theirs',
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index);
}

function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const allSkills = [...TECHNICAL_SKILLS, ...SOFT_SKILLS];
  return allSkills.filter((skill) => lowerText.includes(skill));
}

function resumeToText(resume: Resume): string {
  const parts = [
    resume.personalInfo.firstName,
    resume.personalInfo.lastName,
    resume.summary || '',
    ...resume.experience.map((e) => `${e.position} ${e.company} ${e.description || ''} ${e.achievements.join(' ')}`),
    ...resume.education.map((e) => `${e.degree} ${e.field || ''} ${e.institution}`),
    ...resume.skills.map((s) => s.name),
  ];
  return parts.join(' ');
}

function calculateKeywordScore(matched: number, total: number): number {
  if (total === 0) return 50;
  return Math.min(100, Math.round((matched / total) * 100));
}

function calculateSkillsScore(matched: number, total: number): number {
  if (total === 0) return 50;
  return Math.min(100, Math.round((matched / total) * 100));
}

function calculateExperienceScore(resume: Resume, jobDescription: string): number {
  let score = 30;

  if (resume.experience.length > 0) score += 15;
  if (resume.experience.length >= 2) score += 10;

  const hasAchievements = resume.experience.some((e) => e.achievements.length > 0);
  if (hasAchievements) score += 15;

  const hasMetrics = resume.experience.some((e) =>
    e.achievements.some((a) => /\d+/.test(a))
  );
  if (hasMetrics) score += 15;

  const hasDescriptions = resume.experience.some((e) => e.description && e.description.length > 20);
  if (hasDescriptions) score += 10;

  return Math.min(100, score);
}

function calculateEducationScore(resume: Resume, jobDescription: string): number {
  let score = 30;

  if (resume.education.length > 0) score += 25;
  if (resume.education.some((e) => e.gpa)) score += 10;
  if (resume.education.some((e) => e.field)) score += 10;
  if (resume.education.some((e) => e.endDate)) score += 10;

  return Math.min(100, score);
}

function calculateFormattingScore(resume: Resume): number {
  let score = 50;

  if (resume.summary && resume.summary.length > 50) score += 15;
  if (resume.summary && resume.summary.length <= 500) score += 5;
  if (resume.skills.length >= 5) score += 10;
  if (resume.experience.every((e) => e.achievements.length > 0)) score += 10;

  return Math.min(100, score);
}

function calculateCompletenessScore(resume: Resume): number {
  let score = 0;
  const totalSections = 7;
  let filledSections = 0;

  if (resume.personalInfo.firstName && resume.personalInfo.lastName) filledSections++;
  if (resume.summary && resume.summary.length > 20) filledSections++;
  if (resume.experience.length > 0) filledSections++;
  if (resume.education.length > 0) filledSections++;
  if (resume.skills.length > 0) filledSections++;
  if (resume.personalInfo.email) filledSections++;
  if (resume.personalInfo.phone || resume.personalInfo.location) filledSections++;

  score = Math.round((filledSections / totalSections) * 100);
  return Math.min(100, score);
}

function calculateReadabilityScore(resume: Resume): number {
  let score = 60;

  if (resume.experience.length > 0) {
    const avgBullets = resume.experience.reduce((acc, e) => acc + e.achievements.length, 0) / resume.experience.length;
    if (avgBullets >= 3 && avgBullets <= 8) score += 20;
  }

  if (resume.summary && resume.summary.split('.').length >= 3 && resume.summary.split('.').length <= 6) {
    score += 10;
  }

  if (resume.skills.length >= 5 && resume.skills.length <= 20) score += 10;

  return Math.min(100, score);
}

function calculateContactScore(resume: Resume): number {
  let score = 0;
  if (resume.personalInfo.firstName) score += 15;
  if (resume.personalInfo.lastName) score += 15;
  if (resume.personalInfo.email) score += 20;
  if (resume.personalInfo.phone) score += 15;
  if (resume.personalInfo.location) score += 10;
  if (resume.personalInfo.linkedin) score += 10;
  if (resume.personalInfo.github || resume.personalInfo.website) score += 15;

  return Math.min(100, score);
}

function generateRecommendations(params: {
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  formattingScore: number;
  completenessScore: number;
  readabilityScore: number;
  contactScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  resume: Resume;
}): ATSRecommendation[] {
  const recommendations: ATSRecommendation[] = [];

  if (params.missingKeywords.length > 0) {
    recommendations.push({
      category: 'keyword',
      priority: 'high',
      message: `Missing ${params.missingKeywords.length} keywords from job description`,
      suggestion: `Add these keywords naturally: ${params.missingKeywords.slice(0, 5).join(', ')}`,
    });
  }

  if (params.missingSkills.length > 0) {
    recommendations.push({
      category: 'skill',
      priority: 'high',
      message: `Missing ${params.missingSkills.length} required skills`,
      suggestion: `Add these skills if you have them: ${params.missingSkills.slice(0, 5).join(', ')}`,
    });
  }

  if (params.experienceScore < 70) {
    recommendations.push({
      category: 'experience',
      priority: 'high',
      message: 'Experience section needs improvement',
      suggestion: 'Add quantifiable achievements with metrics (e.g., "Increased sales by 25%"). Use [X] for unknown numbers.',
    });
  }

  if (params.completenessScore < 70) {
    recommendations.push({
      category: 'content',
      priority: 'high',
      message: 'Resume is missing important sections',
      suggestion: 'Add a professional summary, more skills, or additional experience details.',
    });
  }

  if (params.contactScore < 80) {
    recommendations.push({
      category: 'formatting',
      priority: 'medium',
      message: 'Contact information is incomplete',
      suggestion: 'Add email, phone number, and location. Consider adding LinkedIn profile.',
    });
  }

  if (params.readabilityScore < 70) {
    recommendations.push({
      category: 'content',
      priority: 'medium',
      message: 'Resume readability could be improved',
      suggestion: 'Aim for 3-8 bullet points per job. Use clear, concise language.',
    });
  }

  if (params.skillsScore < 60) {
    recommendations.push({
      category: 'skill',
      priority: 'medium',
      message: 'Few matching skills found',
      suggestion: 'Review the job description and add relevant skills you possess.',
    });
  }

  if (params.resume.summary && params.resume.summary.length < 50) {
    recommendations.push({
      category: 'content',
      priority: 'medium',
      message: 'Professional summary is too short',
      suggestion: 'Write a 3-4 sentence summary highlighting your key qualifications and career goals.',
    });
  }

  return recommendations;
}
