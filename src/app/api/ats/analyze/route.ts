import { NextResponse } from 'next/server';
import { analyzeATS } from '@/lib/ats-engine';
import { Resume } from '@/types';

export async function POST(request: Request) {
  try {
    const { resume, jobDescription } = await request.json();

    const analysis = analyzeATS(resume as Resume, jobDescription);

    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
