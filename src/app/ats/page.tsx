'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle, CheckCircle, FileText, Search, Zap } from 'lucide-react';
import { analyzeATS } from '@/lib/ats-engine';
import { Resume as ResumeData, ATSAnalysis } from '@/types';

interface ResumeListItem {
  id: string;
  title: string;
}

export default function ATSPage() {
  const { user, getIdToken } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ATSAnalysis | null>(null);
  const [resumesLoaded, setResumesLoaded] = useState(false);

  const fetchResumes = async () => {
    if (resumesLoaded) return;
    const token = await getIdToken();
    if (!token) return;
    try {
      const res = await fetch('/api/resumes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || data || []);
        setResumesLoaded(true);
      }
    } catch {
      // silently fail
    }
  };

  const handleResumeSelect = async () => {
    await fetchResumes();
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-500';
    if (score <= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = (score: number) => {
    if (score < 50) return 'bg-red-500';
    if (score <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    let resumeData: ResumeData | null = null;

    if (selectedResumeId) {
      const token = await getIdToken();
      if (!token) return;
      try {
        const res = await fetch(`/api/resumes/${selectedResumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          resumeData = await res.json();
        }
      } catch {
        // fall through
      }
    }

    if (!resumeData && resumeText.trim()) {
      resumeData = {
        id: 'pasted',
        userId: '',
        title: 'Pasted Resume',
        templateId: '',
        personalInfo: { firstName: '', lastName: '', email: '' },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
      };
    }

    if (!resumeData) return;

    setLoading(true);
    try {
      const score = analyzeATS(resumeData, jobDescription);
      setResults(score);

      try {
        const aiToken = await getIdToken();
        const aiRes = await fetch('/api/ai/analyze-job', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(aiToken ? { Authorization: `Bearer ${aiToken}` } : {}),
          },
          body: JSON.stringify({ resume: resumeText || JSON.stringify(resumeData), jobDescription }),
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          if (aiData.recommendations) {
            setResults((prev) =>
              prev
                ? {
                    ...prev,
                    recommendations: [
                      ...prev.recommendations,
                      ...aiData.recommendations.map((r: string) => ({
                        category: 'content' as const,
                        priority: 'medium' as const,
                        message: r,
                        suggestion: '',
                      })),
                    ],
                  }
                : prev
            );
          }
        }
      } catch {
        // AI enrichment optional
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            ATS Resume Checker
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            See how your resume performs against Applicant Tracking Systems
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste the job description here..."
                className="min-h-[300px]"
                value={jobDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setJobDescription(e.target.value)
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && (
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                    Select a saved resume
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    value={selectedResumeId}
                    onChange={(e) => {
                      setSelectedResumeId(e.target.value);
                      if (!e.target.value) handleResumeSelect();
                    }}
                    onFocus={handleResumeSelect}
                  >
                    <option value="">-- Paste resume text instead --</option>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                  Or paste resume text
                </label>
                <Textarea
                  placeholder="Paste your resume content here..."
                  className="min-h-[220px]"
                  value={resumeText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setResumeText(e.target.value)
                  }
                  disabled={!!selectedResumeId}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center mb-12">
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={loading || !jobDescription.trim()}
            className="px-8"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {results && (
          <div className="space-y-8">
            <Card className="border-2">
              <CardContent className="pt-8">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                    Overall ATS Score
                  </p>
                  <p
                    className={`text-7xl font-bold ${getScoreColor(
                      results.overallScore
                    )}`}
                  >
                    {results.overallScore}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    out of 100
                  </p>
                  <div className="mt-4 max-w-md mx-auto">
                    <Progress value={results.overallScore} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Keyword Match', value: results.keywordScore },
                { label: 'Skills Match', value: results.skillsScore },
                { label: 'Experience', value: results.experienceScore },
                { label: 'Education', value: results.educationScore },
                { label: 'Formatting', value: results.formattingScore },
              ].map((item) => (
                <Card key={item.label}>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                      {item.label}
                    </p>
                    <p className={`text-3xl font-bold ${getScoreColor(item.value)}`}>
                      {item.value}%
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {results.matchedKeywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    Matched Keywords ({results.matchedKeywords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.matchedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {results.missingKeywords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Missing Keywords ({results.missingKeywords.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full text-sm font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {results.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                            rec.priority === 'high'
                              ? 'bg-red-500'
                              : rec.priority === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span className="text-slate-700 dark:text-slate-300">
                          {rec.message}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              This is an ATS optimization estimate. Actual ATS systems vary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
