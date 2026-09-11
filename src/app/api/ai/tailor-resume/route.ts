import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { resume, jobDescription } = await request.json();

    // In production, this would call OpenAI API
    // For now, return the resume as-is
    const tailoredResume = resume;

    return NextResponse.json({ tailoredResume });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to tailor resume' }, { status: 500 });
  }
}
