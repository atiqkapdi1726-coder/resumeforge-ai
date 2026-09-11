import { NextResponse } from 'next/server';
import { Resume } from '@/types';

// In-memory store for demo (would be Firestore in production)
const resumes: Map<string, Resume> = new Map();

export async function GET() {
  try {
    const resumesList = Array.from(resumes.values());
    return NextResponse.json({ resumes: resumesList });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const resume: Resume = {
      id: 'resume_' + Date.now(),
      userId: 'user_123',
      title: data.title || 'Untitled Resume',
      templateId: data.templateId || 'modern',
      personalInfo: data.personalInfo || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
      },
      summary: data.summary || '',
      experience: data.experience || [],
      education: data.education || [],
      skills: data.skills || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      languages: data.languages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
    };

    resumes.set(resume.id, resume);

    return NextResponse.json({ resume });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}
