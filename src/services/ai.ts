import { Resume } from '@/types';

const AI_ENDPOINT = '/api/ai';

export async function improveSummary(currentSummary: string, jobDescription?: string): Promise<string> {
  const response = await fetch(`${AI_ENDPOINT}/improve-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentSummary, jobDescription }),
  });
  const data = await response.json();
  return data.improvedSummary;
}

export async function improveBulletPoint(bullet: string, jobDescription?: string): Promise<string> {
  const response = await fetch(`${AI_ENDPOINT}/improve-bullet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bullet, jobDescription }),
  });
  const data = await response.json();
  return data.improvedBullet;
}

export async function generateSkills(jobDescription: string): Promise<string[]> {
  const response = await fetch(`${AI_ENDPOINT}/generate-skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobDescription }),
  });
  const data = await response.json();
  return data.skills;
}

export async function tailorResume(resume: Resume, jobDescription: string): Promise<Resume> {
  const response = await fetch(`${AI_ENDPOINT}/tailor-resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobDescription }),
  });
  const data = await response.json();
  return data.tailoredResume;
}

export async function generateCoverLetter(resume: Resume, jobDescription: string, companyName: string): Promise<string> {
  const response = await fetch(`${AI_ENDPOINT}/cover-letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobDescription, companyName }),
  });
  const data = await response.json();
  return data.coverLetter;
}

export async function analyzeJobDescription(jobDescription: string): Promise<{
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
  summary: string;
}> {
  const response = await fetch(`${AI_ENDPOINT}/analyze-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobDescription }),
  });
  const data = await response.json();
  return data.analysis;
}
