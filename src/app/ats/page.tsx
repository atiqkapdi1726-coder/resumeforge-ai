'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface ATSAnalysis {
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  formattingScore: number;
  recommendations: {
    category: string;
    priority: string;
    message: string;
    suggestion: string;
  }[];
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
}

export default function ATSCheckerPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setError('Please provide both job description and resume text');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/ats/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeText }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">ATS Checker</h1>
        <p className="text-muted-foreground mb-8">
          Analyze your resume against a job description to see how well it will perform in ATS systems.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={12}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={12}
              />
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button onClick={handleAnalyze} disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Resume'
            )}
          </Button>
        </div>

        {analysis && (
          <div className="mt-8 space-y-6">
            {/* Overall Score */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {analysis.overallScore}%
                  </div>
                  <p className="text-muted-foreground">ATS Optimization Score</p>
                </div>
                <Progress value={analysis.overallScore} className="mt-4" />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  This is an estimate. Actual ATS systems may vary.
                </p>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Keywords', score: analysis.keywordScore },
                    { label: 'Skills', score: analysis.skillsScore },
                    { label: 'Experience', score: analysis.experienceScore },
                    { label: 'Education', score: analysis.educationScore },
                    { label: 'Formatting', score: analysis.formattingScore },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium">{item.label}</span>
                      <Progress value={item.score} className="flex-1" />
                      <span className="w-12 text-sm text-right">{item.score}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Matched Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Matched Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Missing Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Missing Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        rec.priority === 'high'
                          ? 'bg-destructive/10'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-500/10'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-2 w-2 rounded-full mt-2 ${
                            rec.priority === 'high'
                              ? 'bg-destructive'
                              : rec.priority === 'medium'
                              ? 'bg-yellow-500'
                              : 'bg-primary'
                          }`}
                        />
                        <div>
                          <p className="font-medium">{rec.message}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rec.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
