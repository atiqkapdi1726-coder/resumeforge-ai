'use client';

import { useState, useCallback } from 'react';
import { Resume } from '@/types';

export function useResume() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch('/api/resumes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Fetch resumes error:', error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const fetchResume = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setResume(data.resume);
      }
    } catch (error) {
      console.error('Fetch resume error:', error);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const createResume = useCallback(async (resumeData: Partial<Resume>) => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return null;

      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resumeData),
      });
      if (response.ok) {
        const data = await response.json();
        return data.resume;
      }
      return null;
    } catch (error) {
      console.error('Create resume error:', error);
      return null;
    } finally {
      setSaving(false);
    }
  }, [getToken]);

  const updateResume = useCallback(async (id: string, updates: Partial<Resume>) => {
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) return false;

      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const data = await response.json();
        setResume(data.resume);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update resume error:', error);
      return false;
    } finally {
      setSaving(false);
    }
  }, [getToken]);

  const deleteResume = useCallback(async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return false;

      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setResumes((prev) => prev.filter((r) => r.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete resume error:', error);
      return false;
    }
  }, [getToken]);

  const duplicateResume = useCallback(async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return null;

      const response = await fetch(`/api/resumes/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setResumes((prev) => [data.resume, ...prev]);
        return data.resume;
      }
      return null;
    } catch (error) {
      console.error('Duplicate resume error:', error);
      return null;
    }
  }, [getToken]);

  return {
    resume,
    resumes,
    loading,
    saving,
    fetchResumes,
    fetchResume,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    setResume,
    setResumes,
  };
}
