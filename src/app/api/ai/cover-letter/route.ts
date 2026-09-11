import { NextResponse } from 'next/server';
import { generateCoverLetter, type ResumeInput } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { resume, jobDescription, companyName } = await request.json();

    const letter = await generateCoverLetter(resume as ResumeInput, jobDescription, companyName);
    return NextResponse.json({ result: letter });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Cover letter generation failed';
    if (message.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }
    console.error('AI cover letter error:', error);
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}
