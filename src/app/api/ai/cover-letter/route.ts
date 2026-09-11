import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { resume, jobDescription, companyName } = await request.json();

    // In production, this would call OpenAI API
    // For now, return a template cover letter
    const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position at ${companyName || 'your company'}. With my background in ${resume.personalInfo?.firstName || 'the field'}, I believe I would be a valuable addition to your team.

${resume.summary || 'I bring a wealth of experience and skills to this role.'}

I am excited about the opportunity to contribute to ${companyName || 'your organization'} and would welcome the chance to discuss how my skills and experience align with your needs.

Thank you for considering my application.

Sincerely,
${resume.personalInfo?.firstName || 'Your Name'} ${resume.personalInfo?.lastName || ''}`;

    return NextResponse.json({ coverLetter });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}
