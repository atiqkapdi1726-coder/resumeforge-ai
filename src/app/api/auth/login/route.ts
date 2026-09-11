import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In production, this would authenticate with Firebase
    // For now, return a mock user
    const user = {
      id: 'user_' + Date.now(),
      email,
      displayName: email.split('@')[0],
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

    const response = NextResponse.json({ user });
    response.cookies.set('auth-token', 'mock-token-' + Date.now(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
