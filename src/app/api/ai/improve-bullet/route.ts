import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { bullet, jobDescription } = await request.json();

    // In production, this would call OpenAI API
    // For now, return an improved version
    const improvedBullet = bullet;

    return NextResponse.json({ improvedBullet });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to improve bullet point' }, { status: 500 });
  }
}
