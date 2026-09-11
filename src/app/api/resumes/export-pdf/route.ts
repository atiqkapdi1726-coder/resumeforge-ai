import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = await getAdminAuth().verifyIdToken(token);

    const { resumeId, templateId } = await request.json();

    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID required' }, { status: 400 });
    }

    const doc = await getAdminDb().collection('resumes').doc(resumeId).get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const data = doc.data()!;
    if (data.userId !== decoded.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Increment PDF download count
    const usageRef = getAdminDb().collection('usage').doc(decoded.uid);
    const usageDoc = await usageRef.get();
    if (usageDoc.exists) {
      const usage = usageDoc.data()!;
      await usageRef.update({
        pdfDownloads: (usage.pdfDownloads || 0) + 1,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Return the resume data for client-side PDF generation
    return NextResponse.json({
      resume: { id: doc.id, ...data },
      templateId: templateId || data.templateId || 'classic',
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
