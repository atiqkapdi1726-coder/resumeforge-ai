import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { currentSummary, jobDescription } = await request.json();

    // In production, this would call OpenAI API
    // For now, return an improved version with AI prefix
    const improvedSummary = `Professional with expertise in ${jobDescription ? 'the relevant field' : 'software development'}. ${currentSummary}`;

    return NextResponse.json({ improvedSummary });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to improve summary' }, { status: 500 });
  }
}
