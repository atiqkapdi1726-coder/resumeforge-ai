import OpenAI from 'openai';

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
}

function isAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

function checkAIConfigured() {
  if (!isAIConfigured()) {
    throw new Error('AI service is not configured. Please add OPENAI_API_KEY to your environment variables.');
  }
}

export interface ResumeInput {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  targetJobTitle?: string;
  industry?: string;
  yearsOfExperience?: string;
  currentRole?: string;
  summary?: string;
  experience: Array<{
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description?: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    contribution?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  achievements?: string[];
  awards?: string[];
  languages?: string[];
  volunteering?: Array<{
    organization: string;
    role: string;
    description?: string;
  }>;
  publications?: string[];
}

export async function generateProfessionalSummary(input: ResumeInput): Promise<string> {
  checkAIConfigured();

  const prompt = `You are a professional resume writer. Generate a compelling professional summary for the following person.

Name: ${input.personalInfo.firstName} ${input.personalInfo.lastName}
Target Job Title: ${input.targetJobTitle || 'Professional'}
Industry: ${input.industry || 'General'}
Years of Experience: ${input.yearsOfExperience || 'Not specified'}
Current Role: ${input.currentRole || 'Not specified'}

Work Experience:
${input.experience.map((e) => `- ${e.position} at ${e.company} (${e.startDate} to ${e.isCurrent ? 'Present' : e.endDate || 'Present'})`).join('\n')}

Skills: ${input.skills.join(', ')}

Key Achievements:
${input.achievements?.join('\n') || 'Not provided'}

Education:
${input.education.map((e) => `- ${e.degree} ${e.field ? 'in ' + e.field : ''} from ${e.institution}`).join('\n')}

Write a 3-4 sentence professional summary that:
1. Highlights the candidate's key qualifications
2. Mentions their years of experience and expertise areas
3. Includes relevant skills and achievements
4. Uses strong action words
5. Is tailored for ATS systems
6. Does NOT invent any facts - only use information provided above

If you need a metric that wasn't provided, use [X] as a placeholder.`;

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content || '';
}

export async function rewriteExperienceBullets(
  position: string,
  company: string,
  achievements: string[],
  jobDescription?: string
): Promise<string[]> {
  checkAIConfigured();

  const prompt = `You are a professional resume writer. Rewrite the following experience bullet points to be more impactful and ATS-friendly.

Position: ${position}
Company: ${company}
${jobDescription ? `Target Job Description:\n${jobDescription}` : ''}

Current Bullet Points:
${achievements.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Rewrite each bullet point to:
1. Start with a strong action verb
2. Include quantifiable metrics where possible (use [X] if the actual number is unknown)
3. Highlight the impact/results
4. Be concise (1-2 lines each)
5. Use ATS-friendly keywords
6. Do NOT invent facts - only improve the wording of what's provided
7. If a metric is mentioned but the number is unknown, use [X]

Return ONLY the rewritten bullet points, numbered, one per line.`;

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = completion.choices[0].message.content || '';
  return content
    .split('\n')
    .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

export async function suggestSkills(
  jobDescription: string,
  currentSkills: string[]
): Promise<string[]> {
  checkAIConfigured();

  const prompt = `You are a career advisor. Based on the following job description, suggest relevant skills.

Job Description:
${jobDescription}

Current Skills: ${currentSkills.join(', ')}

Suggest skills that:
1. Are mentioned in the job description but missing from current skills
2. Are commonly required for this type of role
3. Are relevant and specific
4. Include both technical and soft skills where appropriate
5. Do NOT suggest generic skills like "communication" or "teamwork" unless specifically mentioned in the job description

Return ONLY a comma-separated list of skill names.`;

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 300,
  });

  const content = completion.choices[0].message.content || '';
  return content
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !currentSkills.some((cs) => cs.toLowerCase() === s.toLowerCase()));
}

export async function analyzeJobDescription(jobDescription: string) {
  checkAIConfigured();

  const prompt = `Analyze the following job description and extract key information.

Job Description:
${jobDescription}

Return a JSON object with this exact structure (no markdown, just raw JSON):
{
  "jobTitle": "extracted job title",
  "requiredSkills": ["skill1", "skill2"],
  "preferredSkills": ["skill1", "skill2"],
  "keywords": ["keyword1", "keyword2"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "experienceRequirement": "description of experience needed",
  "technologies": ["tech1", "tech2"]
}

Extract at least 10 keywords and 8 skills. Be thorough.`;

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = completion.choices[0].message.content || '{}';
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch {
    return {
      jobTitle: '',
      requiredSkills: [],
      preferredSkills: [],
      keywords: [],
      responsibilities: [],
      experienceRequirement: '',
      technologies: [],
    };
  }
}

export async function tailorResume(
  resume: ResumeInput,
  jobDescription: string,
  jobAnalysis: {
    requiredSkills: string[];
    preferredSkills: string[];
    keywords: string[];
    responsibilities: string[];
  }
): Promise<Partial<ResumeInput>> {
  checkAIConfigured();

  const prompt = `You are a professional resume writer. Tailor the following resume to better match the job description.

Current Resume:
Name: ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}
Target: ${resume.targetJobTitle || 'Professional'}
Summary: ${resume.summary || 'Not provided'}
Skills: ${resume.skills.join(', ')}
Experience: ${resume.experience.map((e) => `${e.position} at ${e.company}: ${e.achievements.join('; ')}`).join('\n')}

Job Requirements:
Required Skills: ${jobAnalysis.requiredSkills.join(', ')}
Preferred Skills: ${jobAnalysis.preferredSkills.join(', ')}
Keywords: ${jobAnalysis.keywords.join(', ')}

Provide suggestions for how to improve the resume to match this job. Return a JSON object with this structure:
{
  "suggestedSummary": "improved summary tailored to the job",
  "skillsToAdd": ["skill1", "skill2"],
  "skillsToRemove": ["skill3"],
  "suggestedKeywords": ["keyword1", "keyword2"],
  "experienceSuggestions": [
    {
      "index": 0,
      "suggestions": ["suggestion1", "suggestion2"]
    }
  ],
  "tailoringTips": ["tip1", "tip2"]
}

IMPORTANT: Do NOT invent new experience, skills, or achievements. Only suggest improvements to existing information.`;

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 1500,
  });

  const content = completion.choices[0].message.content || '{}';
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch {
    return {};
  }
}

export async function generateCoverLetter(
  resume: ResumeInput,
  jobDescription: string,
  companyName: string
): Promise<string> {
  checkAIConfigured();

  const prompt = `You are a professional cover letter writer. Generate a compelling cover letter for the following candidate.

Candidate:
Name: ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}
Current Role: ${resume.currentRole || 'Professional'}
Experience: ${resume.experience.map((e) => `${e.position} at ${e.company}`).join(', ')}
Skills: ${resume.skills.join(', ')}

Company: ${companyName}
Job Description: ${jobDescription}

Write a professional cover letter that:
1. Is addressed to "Dear Hiring Manager"
2. Opens with a strong hook about why you're interested
3. Highlights 2-3 relevant qualifications from the resume
4. Shows knowledge of the company/role
5. Closes with a call to action
6. Is 3-4 paragraphs
7. Uses professional but engaging tone
8. Does NOT invent facts`;

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return completion.choices[0].message.content || '';
}

export async function improveSummary(
  currentSummary: string,
  jobDescription?: string
): Promise<string> {
  checkAIConfigured();

  const prompt = `Improve the following professional summary for a resume.

Current Summary:
${currentSummary}

${jobDescription ? `Target Job Description:\n${jobDescription}` : ''}

Improve it to:
1. Be more impactful and specific
2. Include relevant keywords for ATS
3. Highlight key strengths
4. Be 3-4 sentences
5. Use strong action words
6. Do NOT invent new facts - only improve what's there`;

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content || currentSummary;
}

export async function generateFullResume(input: ResumeInput): Promise<{
  summary: string;
  experience: Array<{ achievements: string[] }>;
  skills: string[];
}> {
  checkAIConfigured();

  const prompt = `You are a professional resume writer. Generate a complete, polished resume for the following person.

Personal Info:
Name: ${input.personalInfo.firstName} ${input.personalInfo.lastName}
Target Job Title: ${input.targetJobTitle || 'Professional'}
Industry: ${input.industry || 'General'}
Years of Experience: ${input.yearsOfExperience || 'Not specified'}
Current Role: ${input.currentRole || 'Not specified'}

Work Experience:
${input.experience.map((e, i) => `
Job ${i + 1}: ${e.position} at ${e.company}
Location: ${e.location || 'Not specified'}
Duration: ${e.startDate} to ${e.isCurrent ? 'Present' : e.endDate || 'Present'}
Description: ${e.description || 'Not provided'}
Achievements: ${e.achievements.length > 0 ? e.achievements.join('; ') : 'Not provided'}
`).join('\n')}

Education:
${input.education.map((e) => `- ${e.degree} ${e.field ? 'in ' + e.field : ''} from ${e.institution} (${e.startDate} - ${e.endDate || 'Present'})`).join('\n')}

Skills: ${input.skills.join(', ')}

Projects:
${input.projects?.map((p) => `- ${p.name}: ${p.description} (Technologies: ${p.technologies.join(', ')})`).join('\n') || 'Not provided'}

Achievements: ${input.achievements?.join(', ') || 'Not provided'}

Generate a complete resume with:

1. A professional summary (3-4 sentences, tailored to the target role)
2. Enhanced experience bullet points for each job (rewrite to be impactful, start with action verbs, include metrics where possible - use [X] for unknown numbers)
3. A comprehensive skill list organized by category

Return JSON:
{
  "summary": "professional summary text",
  "experience": [
    {
      "index": 0,
      "achievements": ["rewritten bullet 1", "rewritten bullet 2"]
    }
  ],
  "skills": ["skill1", "skill2", ...]
}

RULES:
- Do NOT invent companies, jobs, degrees, or certifications
- Do NOT add skills that weren't mentioned
- Use [X] for unknown metrics
- Only improve and organize what was provided
- Make everything ATS-friendly`;

  const completion = await getOpenAI().chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = completion.choices[0].message.content || '{}';
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch {
    return {
      summary: input.summary || '',
      experience: input.experience.map((e) => ({ achievements: e.achievements })),
      skills: input.skills,
    };
  }
}

export { isAIConfigured };
