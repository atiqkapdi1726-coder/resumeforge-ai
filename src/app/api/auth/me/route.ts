import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = {
      id: 'user_123',
      email: 'demo@example.com',
      displayName: 'Demo User',
      subscription: {
        plan: 'free',
        status: 'active',
      },
      usage: {
        resumesCreated: 0,
        atsChecks: 0,
        aiImprovements: 0,
        pdfDownloads: 0,
        lastUpdated: new Date().toISOString(),
      },
    };

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
