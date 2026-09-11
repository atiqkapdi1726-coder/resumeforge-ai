'use client';

import { create } from 'zustand';
import { Resume, ATSAnalysis, User } from '@/types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  currentResume: Resume | null;
  setCurrentResume: (resume: Resume | null) => void;
  atsAnalysis: ATSAnalysis | null;
  setAtsAnalysis: (analysis: ATSAnalysis | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  currentResume: null,
  setCurrentResume: (resume) => set({ currentResume: resume }),
  atsAnalysis: null,
  setAtsAnalysis: (analysis) => set({ atsAnalysis: analysis }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
