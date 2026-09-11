import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { jobDescription, resumeText } = await request.json();

    // Simple keyword matching for demo
    const jobKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resumeText);

    const matchedKeywords = jobKeywords.filter((kw) =>
      resumeKeywords.some((rk) => rk.toLowerCase().includes(kw.toLowerCase()))
    );
    const missingKeywords = jobKeywords.filter(
      (kw) => !resumeKeywords.some((rk) => rk.toLowerCase().includes(kw.toLowerCase()))
    );

    const jobSkills = extractSkills(jobDescription);
    const resumeSkills = extractSkills(resumeText);

    const matchedSkills = jobSkills.filter((js) =>
      resumeSkills.some((rs) => rs.toLowerCase().includes(js.toLowerCase()))
    );
    const missingSkills = jobSkills.filter(
      (js) => !resumeSkills.some((rs) => rs.toLowerCase().includes(js.toLowerCase()))
    );

    const keywordScore = Math.min(100, Math.round((matchedKeywords.length / Math.max(jobKeywords.length, 1)) * 100));
    const skillsScore = Math.min(100, Math.round((matchedSkills.length / Math.max(jobSkills.length, 1)) * 100));
    const experienceScore = resumeText.length > 500 ? 70 : 50;
    const educationScore = resumeText.toLowerCase().includes('education') ? 70 : 50;
    const formattingScore = 75;

    const overallScore = Math.round(
      keywordScore * 0.25 +
      skillsScore * 0.25 +
      experienceScore * 0.2 +
      educationScore * 0.1 +
      formattingScore * 0.2
    );

    const recommendations = [];

    if (missingKeywords.length > 0) {
      recommendations.push({
        category: 'keyword',
        priority: 'high',
        message: `Missing ${missingKeywords.length} keywords from job description`,
        suggestion: `Add these keywords naturally: ${missingKeywords.slice(0, 5).join(', ')}`,
      });
    }

    if (missingSkills.length > 0) {
      recommendations.push({
        category: 'skill',
        priority: 'high',
        message: `Missing ${missingSkills.length} required skills`,
        suggestion: `Add these skills: ${missingSkills.slice(0, 5).join(', ')}`,
      });
    }

    if (resumeText.length < 500) {
      recommendations.push({
        category: 'content',
        priority: 'medium',
        message: 'Resume content is too short',
        suggestion: 'Add more details about your experience and achievements',
      });
    }

    const analysis = {
      overallScore,
      keywordScore,
      skillsScore,
      experienceScore,
      educationScore,
      formattingScore,
      recommendations,
      matchedKeywords,
      missingKeywords: missingKeywords.slice(0, 10),
      matchedSkills,
      missingSkills,
    };

    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze' }, { status: 500 });
  }
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'shall', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
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
    'javascript', 'typescript', 'python', 'java', 'c++', 'react', 'angular', 'vue',
    'node.js', 'express', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git',
    'sql', 'mongodb', 'postgresql', 'html', 'css', 'agile', 'scrum', 'rest api',
  ];

  const lowerText = text.toLowerCase();
  return commonSkills.filter((skill) => lowerText.includes(skill));
}
