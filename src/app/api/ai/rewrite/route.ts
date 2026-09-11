import { NextResponse } from 'next/server';
import { rewriteExperienceBullets } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { position, company, achievements, jobDescription } = await request.json();

    const rewritten = await rewriteExperienceBullets(position, company, achievements, jobDescription);
    return NextResponse.json({ result: rewritten });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI rewrite failed';
    if (message.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }
    console.error('AI rewrite error:', error);
    return NextResponse.json({ error: 'Failed to rewrite content' }, { status: 500 });
  }
}
