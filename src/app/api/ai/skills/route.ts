import { NextResponse } from 'next/server';
import { suggestSkills } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const { jobDescription, currentSkills } = await request.json();

    const skills = await suggestSkills(jobDescription, currentSkills || []);
    return NextResponse.json({ result: skills });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI skill suggestion failed';
    if (message.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }
    console.error('AI skills error:', error);
    return NextResponse.json({ error: 'Failed to suggest skills' }, { status: 500 });
  }
}
