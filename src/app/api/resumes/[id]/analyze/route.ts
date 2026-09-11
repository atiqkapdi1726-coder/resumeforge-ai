import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { canPerformAction } from '@/services/subscription';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await getAdminAuth().verifyIdToken(token);

    const { resumeId, jobDescription } = await request.json();

    if (!resumeId || !jobDescription) {
      return NextResponse.json({ error: 'Resume ID and job description required' }, { status: 400 });
    }

    // Check user's subscription and usage
    const userDoc = await getAdminDb().collection('users').doc(decoded.uid).get();
    const userData = userDoc.data();
    const plan = userData?.subscription?.plan || 'free';

    const usageDoc = await getAdminDb().collection('usage').doc(decoded.uid).get();
    const usage = usageDoc.data();
    const atsChecks = usage?.atsChecks || 0;

    const { allowed, remaining } = canPerformAction(plan, 'maxAtsChecks', atsChecks);
    if (!allowed) {
      return NextResponse.json(
        { error: 'ATS check limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Get resume
    const resumeDoc = await getAdminDb().collection('resumes').doc(resumeId).get();
    if (!resumeDoc.exists) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const resumeData = resumeDoc.data()!;
    if (resumeData.userId !== decoded.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Increment usage
    await getAdminDb().collection('usage').doc(decoded.uid).set(
      {
        atsChecks: atsChecks + 1,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({
      resume: { id: resumeDoc.id, ...resumeData },
      remaining,
    });
  } catch (error) {
    console.error('ATS analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
