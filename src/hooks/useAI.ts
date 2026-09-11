'use client';

import { useCallback } from 'react';

export function useAI() {
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const user = getFirebaseAuth().currentUser;
      if (!user) return null;
      return await user.getIdToken();
    } catch {
      return null;
    }
  }, []);

  const callAI = useCallback(async (endpoint: string, body: Record<string, unknown>): Promise<unknown> => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'AI request failed');
    }

    return data.result;
  }, [getToken]);

  const generateSummary = useCallback(async (input: unknown) => {
    return callAI('/api/ai/generate', { input, action: 'summary' });
  }, [callAI]);

  const generateFullResume = useCallback(async (input: unknown) => {
    return callAI('/api/ai/generate', { input, action: 'generate-full' });
  }, [callAI]);

  const rewriteBullets = useCallback(async (position: string, company: string, achievements: string[], jobDescription?: string) => {
    return callAI('/api/ai/rewrite', { position, company, achievements, jobDescription });
  }, [callAI]);

  const suggestSkills = useCallback(async (jobDescription: string, currentSkills: string[]) => {
    return callAI('/api/ai/skills', { jobDescription, currentSkills });
  }, [callAI]);

  const analyzeJob = useCallback(async (jobDescription: string) => {
    return callAI('/api/ai/analyze-job', { jobDescription });
  }, [callAI]);

  const tailorResume = useCallback(async (resume: unknown, jobDescription: string, jobAnalysis: unknown) => {
    return callAI('/api/ai/tailor', { resume, jobDescription, jobAnalysis });
  }, [callAI]);

  const generateCoverLetter = useCallback(async (resume: unknown, jobDescription: string, companyName: string) => {
    return callAI('/api/ai/cover-letter', { resume, jobDescription, companyName });
  }, [callAI]);

  const improveSummary = useCallback(async (currentSummary: string, jobDescription?: string) => {
    return callAI('/api/ai/improve-summary', { currentSummary, jobDescription });
  }, [callAI]);

  return {
    generateSummary,
    generateFullResume,
    rewriteBullets,
    suggestSkills,
    analyzeJob,
    tailorResume,
    generateCoverLetter,
    improveSummary,
  };
}
