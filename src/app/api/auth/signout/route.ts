import { NextResponse } from 'next/server';
// firebase-admin imports removed — not used in this route

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Sign out failed' }, { status: 500 });
  }
}
