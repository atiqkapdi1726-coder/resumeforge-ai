import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // In production, fetch the original resume from Firestore
    // For now, create a duplicate with new ID
    const duplicate = {
      id: 'resume_' + Date.now(),
      title: 'Copy of Resume',
      // Copy all other fields from original...
    };

    return NextResponse.json({ resume: duplicate });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to duplicate resume' }, { status: 500 });
  }
}
