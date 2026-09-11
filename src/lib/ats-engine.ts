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

  const overallScore = Math.round(
    keywordScore * 0.25 +
    skillsScore * 0.25 +
    experienceScore * 0.2 +
    educationScore * 0.1 +
    formattingScore * 0.2
  );

  const recommendations = generateRecommendations({
    keywordScore,
    skillsScore,
    experienceScore,
    educationScore,
    formattingScore,
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
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index);
}

function extractSkills(text: string): string[] {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'html', 'css', 'sass', 'tailwind', 'bootstrap',
    'agile', 'scrum', 'jira', 'confluence',
    'machine learning', 'deep learning', 'nlp', 'computer vision',
    'rest api', 'graphql', 'microservices', 'serverless',
    'linux', 'bash', 'powershell',
    'figma', 'sketch', 'adobe xd',
    'photoshop', 'illustrator', 'indesign',
  ];

  const lowerText = text.toLowerCase();
  return commonSkills.filter((skill) => lowerText.includes(skill));
}

function resumeToText(resume: Resume): string {
  const parts = [
    resume.personalInfo.firstName,
    resume.personalInfo.lastName,
    resume.summary,
    ...resume.experience.map((e) => `${e.position} ${e.company} ${e.description} ${e.achievements.join(' ')}`),
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
  let score = 50;

  const hasExperience = resume.experience.length > 0;
  if (hasExperience) score += 20;

  const hasAchievements = resume.experience.some((e) => e.achievements.length > 0);
  if (hasAchievements) score += 15;

  const hasMetrics = resume.experience.some((e) =>
    e.achievements.some((a) => /\d+/.test(a))
  );
  if (hasMetrics) score += 15;

  return Math.min(100, score);
}

function calculateEducationScore(resume: Resume, jobDescription: string): number {
  let score = 50;

  if (resume.education.length > 0) score += 30;
  if (resume.education.some((e) => e.gpa)) score += 10;
  if (resume.education.some((e) => e.achievements && e.achievements.length > 0)) score += 10;

  return Math.min(100, score);
}

function calculateFormattingScore(resume: Resume): number {
  let score = 70;

  if (resume.personalInfo.email) score += 10;
  if (resume.personalInfo.phone) score += 5;
  if (resume.personalInfo.location) score += 5;
  if (resume.summary && resume.summary.length > 50) score += 10;

  return Math.min(100, score);
}

function generateRecommendations(params: {
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  formattingScore: number;
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
      suggestion: `Add these skills: ${params.missingSkills.slice(0, 5).join(', ')}`,
    });
  }

  if (params.experienceScore < 70) {
    recommendations.push({
      category: 'experience',
      priority: 'medium',
      message: 'Experience section needs improvement',
      suggestion: 'Add quantifiable achievements with metrics (e.g., "Increased sales by 25%")',
    });
  }

  if (params.formattingScore < 80) {
    recommendations.push({
      category: 'formatting',
      priority: 'medium',
      message: 'Contact information is incomplete',
      suggestion: 'Add email, phone number, and location',
    });
  }

  if (params.resume.summary.length < 100) {
    recommendations.push({
      category: 'content',
      priority: 'medium',
      message: 'Professional summary is too short',
      suggestion: 'Write a 3-4 sentence summary highlighting your key qualifications',
    });
  }

  return recommendations;
}
