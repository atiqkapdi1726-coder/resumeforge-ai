import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { jobDescription } = await request.json();

    // In production, this would call OpenAI API
    // For now, return common skills
    const skills = [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'SQL',
      'Git',
      'REST APIs',
      'Agile',
      'Problem Solving',
    ];

    return NextResponse.json({ skills });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate skills' }, { status: 500 });
  }
}
