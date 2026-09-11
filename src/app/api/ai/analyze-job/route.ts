import { NextResponse } from 'next/server';
import { analyzeJobDescription } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { jobDescription } = await request.json();

    const analysis = await analyzeJobDescription(jobDescription);
    return NextResponse.json({ result: analysis });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Job analysis failed';
    if (message.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }
    console.error('AI job analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze job description' }, { status: 500 });
  }
}
