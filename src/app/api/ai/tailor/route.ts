import { NextResponse } from 'next/server';
import { tailorResume, type ResumeInput } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { resume, jobDescription, jobAnalysis } = await request.json();

    const suggestions = await tailorResume(resume as ResumeInput, jobDescription, jobAnalysis);
    return NextResponse.json({ result: suggestions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Resume tailoring failed';
    if (message.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }
    console.error('AI tailor error:', error);
    return NextResponse.json({ error: 'Failed to tailor resume' }, { status: 500 });
  }
}
