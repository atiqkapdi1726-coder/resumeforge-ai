'use client';

import { useState, useCallback } from 'react';
import { Resume } from '@/types';

export function useResume() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchResume = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/resumes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setResume(data.resume);
      }
    } catch (error) {
      console.error('Fetch resume error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResume = useCallback(async (id: string, updates: Partial<Resume>) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
  }, []);

  const createResume = useCallback(async (title: string, templateId: string) => {
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, templateId }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.resume;
      }
      return null;
    } catch (error) {
      console.error('Create resume error:', error);
      return null;
    }
  }, []);

  const deleteResume = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      return response.ok;
    } catch (error) {
      console.error('Delete resume error:', error);
      return false;
    }
  }, []);

  const duplicateResume = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}/duplicate`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        return data.resume;
      }
      return null;
    } catch (error) {
      console.error('Duplicate resume error:', error);
      return null;
    }
  }, []);

  return {
    resume,
    loading,
    saving,
    fetchResume,
    updateResume,
    createResume,
    deleteResume,
    duplicateResume,
    setResume,
  };
}
