import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';

async function verifyAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split('Bearer ')[1];
  try {
    return await getAdminAuth().verifyIdToken(token);
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const doc = await getAdminDb().collection('resumes').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const data = doc.data()!;
    if (data.userId !== decoded.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ resume: { id: doc.id, ...data } });
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const doc = await getAdminDb().collection('resumes').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const data = doc.data()!;
    if (data.userId !== decoded.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = await request.json();
    delete updates.id;
    delete updates.userId;
    delete updates.createdAt;

    await getAdminDb().collection('resumes').doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await getAdminDb().collection('resumes').doc(id).get();

    return NextResponse.json({ resume: { id: updatedDoc.id, ...updatedDoc.data() } });
  } catch (error) {
    console.error('Failed to update resume:', error);
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const doc = await getAdminDb().collection('resumes').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const data = doc.data()!;
    if (data.userId !== decoded.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await getAdminDb().collection('resumes').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete resume:', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
