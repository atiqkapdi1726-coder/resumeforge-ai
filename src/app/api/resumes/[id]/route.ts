import { NextResponse } from 'next/server';
import { Resume } from '@/types';

// In-memory store for demo
const resumes: Map<string, Resume> = new Map();

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const resume = resumes.get(id);

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updates = await request.json();

    const resume = resumes.get(id);
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const updatedResume: Resume = {
      ...resume,
      ...updates,
      updatedAt: new Date(),
    };

    resumes.set(id, updatedResume);

    return NextResponse.json({ resume: updatedResume });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!resumes.has(id)) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    resumes.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
