'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AIWizard from '@/components/resume/ai-wizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sparkles, FileText, ArrowLeft, Loader2 } from 'lucide-react';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant styling' },
  { id: 'creative', name: 'Creative', description: 'Bold and eye-catching design' },
  { id: 'executive', name: 'Executive', description: 'Sophisticated and polished' },
  { id: 'technical', name: 'Technical', description: 'Optimized for tech roles' },
];

function NewResumeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, getIdToken } = useAuth();

  const mode = searchParams.get('mode');

  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const createResume = async (resumeData: any, templateOverride?: string) => {
    const token = await getIdToken();
    if (!token) {
      router.push('/login');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...resumeData,
          title: resumeData.title || title || 'Untitled Resume',
          templateId: templateOverride || selectedTemplate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create resume');
      }

      const data = await response.json();
      const newId = data.resume?.id || data.id;
      router.push(`/resumes/${newId}/edit`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setCreating(false);
    }
  };

  const handleAIWizardComplete = (resumeData: any) => {
    createResume(resumeData);
  };

  const handleCreateFromScratch = async () => {
    if (!title.trim()) {
      setError('Please enter a resume title');
      return;
    }
    createResume({ title: title.trim(), templateId: selectedTemplate }, selectedTemplate);
  };

  if (mode === 'ai') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/resumes/new')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to options
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create Resume with AI</h1>
            <p className="text-gray-600 mt-1">
              Answer a few questions and AI will build your complete ATS-friendly resume
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {creating ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium text-gray-900">Saving your resume...</p>
              <p className="text-gray-600 mt-1">You&apos;ll be redirected to the editor shortly</p>
            </div>
          ) : (
            <AIWizard
              onComplete={handleAIWizardComplete}
              onCancel={() => router.push('/resumes/new')}
            />
          )}
        </div>
      </div>
    );
  }

  if (mode === 'scratch') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-3xl px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/resumes/new')}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to options
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create from Scratch</h1>
            <p className="text-gray-600 mt-1">
              Set up your resume details and start editing
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resume Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Resume Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., Software Engineer Resume"
                  className="text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose a Template
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {template.name}
                        </span>
                        {selectedTemplate === template.id && (
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/resumes/new')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFromScratch}
              disabled={creating || !title.trim()}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Resume
                </>
              )}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Create a New Resume</h1>
          <p className="mt-2 text-lg text-gray-600">
            Choose how you&apos;d like to build your resume
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary"
            onClick={() => router.push('/resumes/new?mode=ai')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Create with AI</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Tell us about yourself and AI will build your complete ATS-friendly resume
              </p>
              <Button
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/resumes/new?mode=ai');
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start with AI
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary"
            onClick={() => router.push('/resumes/new?mode=scratch')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">Create from Scratch</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Start with a blank template and build your resume manually
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/resumes/new?mode=scratch');
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Start from Scratch
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NewResumePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <NewResumeContent />
    </Suspense>
  );
}
