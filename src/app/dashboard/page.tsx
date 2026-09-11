'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Plus, Trash2, Copy, BarChart3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Resume {
  id: string;
  title: string;
  updatedAt: string;
  atsScore?: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('/api/resumes');
        if (response.ok) {
          const data = await response.json();
          setResumes(data.resumes);
        }
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
      } finally {
        setLoadingResumes(false);
      }
    };

    if (user) {
      fetchResumes();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setResumes(resumes.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}/duplicate`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setResumes([...resumes, data.resume]);
      }
    } catch (error) {
      console.error('Failed to duplicate resume:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-20 flex justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold">Sign in to view your dashboard</h2>
            <p className="mt-2 text-muted-foreground">
              Create an account to start building your resume.
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.displayName}!
          </p>
        </div>
        <Link href="/resumes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Total Resumes</p>
                <p className="text-2xl font-bold">{resumes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Avg. ATS Score</p>
                <p className="text-2xl font-bold">
                  {resumes.length > 0
                    ? Math.round(
                        resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / resumes.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="text-2xl font-bold capitalize">{user.subscription.plan}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumes List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Resumes</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingResumes ? (
            <div className="text-center py-8 text-muted-foreground">Loading resumes...</div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No resumes yet</h3>
              <p className="text-muted-foreground">
                Create your first resume to get started.
              </p>
              <Link href="/resumes/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Resume
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-primary mr-4" />
                    <div>
                      <h3 className="font-semibold">{resume.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Updated {formatDate(resume.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {resume.atsScore && (
                      <span className="px-2 py-1 text-sm bg-primary/10 text-primary rounded">
                        {resume.atsScore}%
                      </span>
                    )}
                    <Link href={`/resumes/${resume.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(resume.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resume.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
