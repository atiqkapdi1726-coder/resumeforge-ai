import { NextResponse } from 'next/server';
import { generateProfessionalSummary, generateFullResume, type ResumeInput } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { input, action } = await request.json();

    if (action === 'generate-full') {
      const result = await generateFullResume(input as ResumeInput);
      return NextResponse.json({ result });
    }

    const summary = await generateProfessionalSummary(input as ResumeInput);
    return NextResponse.json({ result: summary });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI generation failed';
    if (message.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }
    console.error('AI generate error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
