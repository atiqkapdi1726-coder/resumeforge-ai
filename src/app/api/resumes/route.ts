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

export async function GET(request: Request) {
  try {
    const decoded = await verifyAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resumesRef = getAdminDb().collection('resumes').where('userId', '==', decoded.uid).orderBy('updatedAt', 'desc');
    const snapshot = await resumesRef.get();
    const resumes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Failed to fetch resumes:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const decoded = await verifyAuth(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const resumeData = {
      userId: decoded.uid,
      title: data.title || 'Untitled Resume',
      templateId: data.templateId || 'classic',
      personalInfo: data.personalInfo || {},
      summary: data.summary || '',
      experience: data.experience || [],
      education: data.education || [],
      skills: data.skills || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      languages: data.languages || [],
      achievements: data.achievements || [],
      awards: data.awards || [],
      volunteering: data.volunteering || [],
      publications: data.publications || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      atsScore: null,
      isPublic: false,
      shareId: null,
      sectionOrder: data.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects'],
      visibleSections: data.visibleSections || ['summary', 'experience', 'education', 'skills', 'projects'],
      fontStyle: data.fontStyle || 'inter',
      fontSize: data.fontSize || 'medium',
      margins: data.margins || 'normal',
    };

    const docRef = await getAdminDb().collection('resumes').add(resumeData);

    return NextResponse.json({
      resume: { id: docRef.id, ...resumeData },
    });
  } catch (error) {
    console.error('Failed to create resume:', error);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}
