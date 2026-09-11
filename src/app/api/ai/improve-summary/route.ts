import { NextResponse } from 'next/server';
import { improveSummary } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { currentSummary, jobDescription } = await request.json();

    const improved = await improveSummary(currentSummary, jobDescription);
    return NextResponse.json({ result: improved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Summary improvement failed';
    if (message.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }
    console.error('AI summary error:', error);
    return NextResponse.json({ error: 'Failed to improve summary' }, { status: 500 });
  }
}
