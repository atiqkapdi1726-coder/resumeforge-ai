'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ResumePreview } from '@/components/resume/templates';
import { useAuth } from '@/hooks/useAuth';
import { generateId } from '@/lib/utils';
import {
  ArrowLeft,
  Save,
  Download,
  Loader2,
  Plus,
  Trash2,
  Wand2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  Pencil,
  Check,
  X,
  FileText,
  Briefcase,
} from 'lucide-react';
import type { Resume } from '@/components/resume/templates';

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface EditorResume {
  id: string;
  title: string;
  templateId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: string[];
}

const TEMPLATES = [
  { id: 'classic-ats', name: 'Classic ATS' },
  { id: 'modern-professional', name: 'Modern Professional' },
  { id: 'executive', name: 'Executive' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'graduate', name: 'Graduate' },
  { id: 'technical', name: 'Technical' },
];

interface JobAnalysisResult {
  requiredSkills?: string[];
  keywords?: string[];
  preferredSkills?: string[];
  summary?: string;
}

interface TailorSuggestionResult {
  summary?: string;
  experience?: Array<{ achievements?: string[] }>;
  skills?: string[];
}

function toPreviewResume(resume: EditorResume): Resume {
  return {
    personalInfo: {
      firstName: resume.personalInfo.firstName,
      lastName: resume.personalInfo.lastName,
      email: resume.personalInfo.email,
      phone: resume.personalInfo.phone || undefined,
      location: resume.personalInfo.location || undefined,
      linkedin: resume.personalInfo.linkedin || undefined,
      github: resume.personalInfo.github || undefined,
      website: resume.personalInfo.website || undefined,
    },
    summary: resume.summary || undefined,
    experience: resume.experience.map((exp) => ({
      company: exp.company,
      position: exp.position,
      location: exp.location || undefined,
      startDate: exp.startDate,
      endDate: exp.endDate || undefined,
      isCurrent: exp.isCurrent,
      achievements: exp.achievements.filter((a) => a.trim()),
    })),
    education: resume.education.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field || undefined,
      startDate: edu.startDate,
      endDate: edu.endDate || undefined,
      gpa: edu.gpa || undefined,
    })),
    skills: resume.skills,
    projects: resume.projects.map((p) => ({
      name: p.name,
      description: p.description,
      technologies: p.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      url: p.url || undefined,
    })),
    certifications: resume.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      date: c.date,
    })),
    languages: resume.languages.length > 0 ? resume.languages : undefined,
  };
}

function Section({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  actions,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-foreground mb-1.5">
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  );
}

export default function ResumeEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading, getIdToken } = useAuth();

  const resumeId = params.id as string;

  const [resume, setResume] = useState<EditorResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
    languages: false,
  });

  const [jobTailorOpen, setJobTailorOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysisResult | null>(null);
  const [tailorSuggestions, setTailorSuggestions] = useState<TailorSuggestionResult | null>(null);
  const [analyzingJob, setAnalyzingJob] = useState(false);
  const [tailoringResume, setTailoringResume] = useState(false);

  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
  const [skillInput, setSkillInput] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [suggestionJobDesc, setSuggestionJobDesc] = useState('');
  const [previewRef, setPreviewRef] = useState<HTMLDivElement | null>(null);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  interface RawExperience {
  id?: string;
  company?: string;
  position?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  achievements?: string[];
}

interface RawEducation {
  id?: string;
  institution?: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

interface RawProject {
  id?: string;
  name?: string;
  description?: string;
  technologies?: string | string[];
  url?: string;
}

interface RawCertification {
  id?: string;
  name?: string;
  issuer?: string;
  date?: string;
}

interface RawResume {
  id?: string;
  title?: string;
  templateId?: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary?: string;
  experience?: RawExperience[];
  education?: RawEducation[];
  skills?: string[];
  projects?: RawProject[];
  certifications?: RawCertification[];
  languages?: string[];
}

const fetchResume = useCallback(async () => {
    if (!user || !resumeId) return;
    try {
      const token = await getIdToken();
      if (!token) return;
      const response = await fetch(`/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to load resume');
      const data = await response.json();
      const r: RawResume = data.resume;
      setResume({
        id: r.id || resumeId,
        title: r.title || 'Untitled Resume',
        templateId: r.templateId || 'modern-professional',
        personalInfo: {
          firstName: r.personalInfo?.firstName || '',
          lastName: r.personalInfo?.lastName || '',
          email: r.personalInfo?.email || '',
          phone: r.personalInfo?.phone || '',
          location: r.personalInfo?.location || '',
          linkedin: r.personalInfo?.linkedin || '',
          github: r.personalInfo?.github || '',
          website: r.personalInfo?.website || '',
        },
        summary: r.summary || '',
        experience: (r.experience || []).map((e) => ({
          id: e.id || generateId(),
          company: e.company || '',
          position: e.position || '',
          location: e.location || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          isCurrent: e.isCurrent || false,
          description: e.description || '',
          achievements: e.achievements && e.achievements.length > 0 ? e.achievements : [''],
        })),
        education: (r.education || []).map((e) => ({
          id: e.id || generateId(),
          institution: e.institution || '',
          degree: e.degree || '',
          field: e.field || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
          gpa: e.gpa || '',
        })),
        skills: r.skills || [],
        projects: (r.projects || []).map((p) => ({
          id: p.id || generateId(),
          name: p.name || '',
          description: p.description || '',
          technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''),
          url: p.url || '',
        })),
        certifications: (r.certifications || []).map((c) => ({
          id: c.id || generateId(),
          name: c.name || '',
          issuer: c.issuer || '',
          date: c.date || '',
        })),
        languages: r.languages || [],
      });
      lastSavedRef.current = JSON.stringify(data.resume);
      setSaveStatus('saved');
    } catch (err) {
      setError('Failed to load resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, resumeId, getIdToken]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchResume();
      }
    }
  }, [authLoading, user, fetchResume, router]);

  const saveResume = useCallback(
    async (resumeData: EditorResume) => {
      if (!user || !resumeId) return;
      setSaveStatus('saving');
      try {
        const token = await getIdToken();
        if (!token) throw new Error('Not authenticated');
        const payload = {
          title: resumeData.title,
          templateId: resumeData.templateId,
          personalInfo: resumeData.personalInfo,
          summary: resumeData.summary,
          experience: resumeData.experience,
          education: resumeData.education,
          skills: resumeData.skills,
          projects: resumeData.projects.map((p) => ({
            ...p,
            technologies: p.technologies
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean),
          })),
          certifications: resumeData.certifications,
          languages: resumeData.languages,
        };
        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Save failed');
        const data = await response.json();
        lastSavedRef.current = JSON.stringify(data.resume);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    },
    [user, resumeId, getIdToken]
  );

  const updateResume = useCallback(
    (updates: Partial<EditorResume>) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...updates };
        const serialized = JSON.stringify(next);
        if (serialized !== lastSavedRef.current) {
          setSaveStatus('unsaved');
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = setTimeout(() => {
            saveResume(next);
          }, 2000);
        }
        return next;
      });
    },
    [saveResume]
  );

  const updatePersonalInfo = useCallback(
    (field: string, value: string) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          personalInfo: { ...prev.personalInfo, [field]: value },
        };
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          saveResume(next);
        }, 2000);
        return next;
      });
    },
    [saveResume]
  );

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const handleManualSave = useCallback(() => {
    if (resume) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveResume(resume);
    }
  }, [resume, saveResume]);

  const addExperience = useCallback(() => {
    const newExp: Experience = {
      id: generateId(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: [''],
    };
    updateResume({
      experience: [...(resume?.experience || []), newExp],
    });
    setOpenSections((prev) => ({ ...prev, experience: true }));
  }, [resume, updateResume]);

  const updateExperience = useCallback(
    (id: string, field: keyof Experience, value: Experience[keyof Experience]) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          experience: prev.experience.map((e) =>
            e.id === id ? { ...e, [field]: value } : e
          ),
        };
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveResume(next), 2000);
        return next;
      });
    },
    [saveResume]
  );

  const removeExperience = useCallback(
    (id: string) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          experience: prev.experience.filter((e) => e.id !== id),
        };
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveResume(next), 2000);
        return next;
      });
    },
    [saveResume]
  );

  const addEducation = useCallback(() => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    updateResume({
      education: [...(resume?.education || []), newEdu],
    });
    setOpenSections((prev) => ({ ...prev, education: true }));
  }, [resume, updateResume]);

  const updateEducation = useCallback(
    (id: string, field: keyof Education, value: string) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          education: prev.education.map((e) =>
            e.id === id ? { ...e, [field]: value } : e
          ),
        };
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveResume(next), 2000);
        return next;
      });
    },
    [saveResume]
  );

  const removeEducation = useCallback(
    (id: string) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          education: prev.education.filter((e) => e.id !== id),
        };
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveResume(next), 2000);
        return next;
      });
    },
    [saveResume]
  );

  const addSkill = useCallback(
    (skill: string) => {
      const trimmed = skill.trim();
      if (trimmed && !(resume?.skills || []).some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
        updateResume({ skills: [...(resume?.skills || []), trimmed] });
      }
    },
    [resume, updateResume]
  );

  const removeSkill = useCallback(
    (skill: string) => {
      updateResume({ skills: (resume?.skills || []).filter((s) => s !== skill) });
    },
    [resume, updateResume]
  );

  const addProject = useCallback(() => {
    const newProj: Project = {
      id: generateId(),
      name: '',
      description: '',
      technologies: '',
      url: '',
    };
    updateResume({ projects: [...(resume?.projects || []), newProj] });
    setOpenSections((prev) => ({ ...prev, projects: true }));
  }, [resume, updateResume]);

  const updateProject = useCallback(
    (id: string, field: keyof Project, value: string) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          projects: prev.projects.map((p) =>
            p.id === id ? { ...p, [field]: value } : p
          ),
        };
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveResume(next), 2000);
        return next;
      });
    },
    [saveResume]
  );

  const removeProject = useCallback(
    (id: string) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          projects: prev.projects.filter((p) => p.id !== id),
        };
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveResume(next), 2000);
        return next;
      });
    },
    [saveResume]
  );

  const addCertification = useCallback(() => {
    const newCert: Certification = {
      id: generateId(),
      name: '',
      issuer: '',
      date: '',
    };
    updateResume({ certifications: [...(resume?.certifications || []), newCert] });
    setOpenSections((prev) => ({ ...prev, certifications: true }));
  }, [resume, updateResume]);

  const updateCertification = useCallback(
    (id: string, field: keyof Certification, value: string) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          certifications: prev.certifications.map((c) =>
            c.id === id ? { ...c, [field]: value } : c
          ),
        };
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveResume(next), 2000);
        return next;
      });
    },
    [saveResume]
  );

  const removeCertification = useCallback(
    (id: string) => {
      setResume((prev) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          certifications: prev.certifications.filter((c) => c.id !== id),
        };
        setSaveStatus('unsaved');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveResume(next), 2000);
        return next;
      });
    },
    [saveResume]
  );

  const addLanguage = useCallback(() => {
    const newLang = skillInput.trim();
    if (newLang && !(resume?.languages || []).some((l) => l.toLowerCase() === newLang.toLowerCase())) {
      updateResume({ languages: [...(resume?.languages || []), newLang] });
      setSkillInput('');
    }
  }, [skillInput, resume, updateResume]);

  const removeLanguage = useCallback(
    (lang: string) => {
      updateResume({ languages: (resume?.languages || []).filter((l) => l !== lang) });
    },
    [resume, updateResume]
  );

  const handleAiImproveSummary = useCallback(async () => {
    if (!resume?.summary?.trim()) return;
    setAiLoading((prev) => ({ ...prev, summary: true }));
    try {
      const response = await fetch('/api/ai/improve-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSummary: resume.summary, jobDescription: jobDescription || undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to improve summary');
      updateResume({ summary: data.result || resume.summary });
    } catch (err: unknown) {
      console.error('AI summary error:', err instanceof Error ? err.message : err);
    } finally {
      setAiLoading((prev) => ({ ...prev, summary: false }));
    }
  }, [resume, jobDescription, updateResume]);

  const handleAiRewrite = useCallback(
    async (expId: string, achievementIndex: number) => {
      const exp = resume?.experience.find((e) => e.id === expId);
      if (!exp) return;
      const bullet = exp.achievements[achievementIndex];
      if (!bullet?.trim()) return;

      const key = `rewrite-${expId}-${achievementIndex}`;
      setAiLoading((prev) => ({ ...prev, [key]: true }));
      try {
        const response = await fetch('/api/ai/rewrite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            position: exp.position,
            company: exp.company,
            achievements: [bullet],
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to rewrite');
        const rewritten = data.result?.[0] || bullet;
        updateExperience(expId, 'achievements', (() => {
          const newAchs = [...exp.achievements];
          newAchs[achievementIndex] = rewritten;
          return newAchs;
        })());
      } catch (err: unknown) {
        console.error('AI rewrite error:', err instanceof Error ? err.message : err);
      } finally {
        setAiLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [resume, updateExperience]
  );

  const handleAiSuggestSkills = useCallback(async () => {
    if (!suggestionJobDesc.trim()) return;
    setAiLoading((prev) => ({ ...prev, skills: true }));
    try {
      const response = await fetch('/api/ai/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: suggestionJobDesc, currentSkills: resume?.skills || [] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to suggest skills');
      setSuggestedSkills(data.result || []);
    } catch (err: unknown) {
      console.error('AI skills error:', err instanceof Error ? err.message : err);
    } finally {
      setAiLoading((prev) => ({ ...prev, skills: false }));
    }
  }, [suggestionJobDesc, resume]);

  const handleAnalyzeJob = useCallback(async () => {
    if (!jobDescription.trim()) return;
    setAnalyzingJob(true);
    setJobAnalysis(null);
    setTailorSuggestions(null);
    try {
      const response = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze job');
      setJobAnalysis(data.result);
    } catch (err: unknown) {
      console.error('AI analyze error:', err instanceof Error ? err.message : err);
    } finally {
      setAnalyzingJob(false);
    }
  }, [jobDescription]);

  const handleTailorResume = useCallback(async () => {
    if (!jobDescription.trim() || !resume) return;
    setTailoringResume(true);
    setTailorSuggestions(null);
    try {
      const resumeData = {
        personalInfo: resume.personalInfo,
        summary: resume.summary,
        experience: resume.experience.map((e) => ({
          position: e.position,
          company: e.company,
          achievements: e.achievements,
        })),
        education: resume.education.map((e) => ({
          institution: e.institution,
          degree: e.degree,
          field: e.field,
        })),
        skills: resume.skills,
      };
      const response = await fetch('/api/ai/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeData, jobDescription, jobAnalysis }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to tailor resume');
      setTailorSuggestions(data.result);
    } catch (err: unknown) {
      console.error('AI tailor error:', err instanceof Error ? err.message : err);
    } finally {
      setTailoringResume(false);
    }
  }, [jobDescription, jobAnalysis, resume]);

  const handleApplySuggestions = useCallback(() => {
    if (!tailorSuggestions || !resume) return;
    const updated = { ...resume };
    if (tailorSuggestions.summary) {
      updated.summary = tailorSuggestions.summary;
    }
    if (tailorSuggestions.experience && Array.isArray(tailorSuggestions.experience)) {
      const suggestions = tailorSuggestions.experience;
      updated.experience = updated.experience.map((exp, i) => {
        const suggestion = suggestions[i];
        if (suggestion?.achievements) {
          return { ...exp, achievements: suggestion.achievements };
        }
        return exp;
      });
    }
    if (tailorSuggestions.skills && Array.isArray(tailorSuggestions.skills)) {
      const merged = [...new Set([...updated.skills, ...tailorSuggestions.skills])];
      updated.skills = merged;
    }
    setResume(updated);
    setSaveStatus('unsaved');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveResume(updated), 2000);
    setJobTailorOpen(false);
    setTailorSuggestions(null);
    setJobAnalysis(null);
    setJobDescription('');
  }, [tailorSuggestions, resume, saveResume]);

  const handleDownloadPdf = useCallback(async () => {
    if (!previewRef) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(previewRef, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume?.title || 'resume'}.pdf`);
    } catch (err) {
      console.error('PDF download error:', err);
    }
  }, [previewRef, resume]);

  const handleTemplateChange = useCallback(
    (templateId: string) => {
      updateResume({ templateId });
    },
    [updateResume]
  );

  const previewResume = useMemo(() => {
    return resume ? toPreviewResume(resume) : null;
  }, [resume]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">{error || 'Resume not found'}</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* TOP BAR */}
      <header className="border-b bg-card shrink-0">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Input
              value={resume.title}
              onChange={(e) => updateResume({ title: e.target.value })}
              className="text-base font-semibold border-none focus-visible:ring-0 w-48 md:w-64 bg-transparent"
              placeholder="Resume Title"
            />
            <span className="hidden md:inline text-xs text-muted-foreground">
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" /> Saved
                </span>
              )}
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                </span>
              )}
              {saveStatus === 'unsaved' && (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" /> Unsaved
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center gap-1 text-destructive">
                  <X className="h-3 w-3" /> Save failed
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile view toggle */}
            <div className="flex md:hidden border rounded-md overflow-hidden">
              <button
                onClick={() => setMobileView('editor')}
                className={`px-3 py-1.5 text-xs flex items-center gap-1 ${
                  mobileView === 'editor' ? 'bg-primary text-primary-foreground' : 'bg-background'
                }`}
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => setMobileView('preview')}
                className={`px-3 py-1.5 text-xs flex items-center gap-1 ${
                  mobileView === 'preview' ? 'bg-primary text-primary-foreground' : 'bg-background'
                }`}
              >
                <Eye className="h-3 w-3" />
                Preview
              </button>
            </div>

            {/* Template selector */}
            <select
              value={resume.templateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="hidden md:flex h-9 rounded-md border bg-background px-3 text-sm"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setJobTailorOpen(true)}
              className="hidden md:flex"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Tailor to Job
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">PDF</span>
            </Button>

            <Button
              size="sm"
              onClick={handleManualSave}
              disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            >
              <Save className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Save</span>
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* EDITOR PANEL */}
        <div
          className={`${
            mobileView === 'editor' ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-1/2 border-r overflow-y-auto`}
        >
          <div className="p-4 space-y-4">
            {/* Personal Information */}
            <Section
              title="Personal Information"
              icon={<FileText className="h-4 w-4" />}
              isOpen={openSections.personal}
              onToggle={() => toggleSection('personal')}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label required>First Name</Label>
                  <Input
                    value={resume.personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label required>Last Name</Label>
                  <Input
                    value={resume.personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <Label required>Email</Label>
                <Input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={resume.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={resume.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
              <div>
                <Label>LinkedIn URL</Label>
                <Input
                  value={resume.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>GitHub URL</Label>
                  <Input
                    value={resume.personalInfo.github}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    placeholder="https://github.com/johndoe"
                  />
                </div>
                <div>
                  <Label>Website / Portfolio</Label>
                  <Input
                    value={resume.personalInfo.website}
                    onChange={(e) => updatePersonalInfo('website', e.target.value)}
                    placeholder="https://johndoe.dev"
                  />
                </div>
              </div>
            </Section>

            {/* Professional Summary */}
            <Section
              title="Professional Summary"
              icon={<FileText className="h-4 w-4" />}
              isOpen={openSections.summary}
              onToggle={() => toggleSection('summary')}
            >
              <div>
                <Label>Summary</Label>
                <Textarea
                  value={resume.summary}
                  onChange={(e) => updateResume({ summary: e.target.value })}
                  placeholder="Write a brief summary of your professional background and key achievements..."
                  rows={4}
                  className="mt-1"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAiImproveSummary}
                disabled={aiLoading.summary || !resume.summary?.trim()}
              >
                {aiLoading.summary ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Improve with AI
              </Button>
            </Section>

            {/* Work Experience */}
            <Section
              title="Work Experience"
              icon={<Briefcase className="h-4 w-4" />}
              isOpen={openSections.experience}
              onToggle={() => toggleSection('experience')}
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    addExperience();
                  }}
                  className="h-7 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              }
            >
              {resume.experience.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No experience added yet.
                </p>
              ) : (
                resume.experience.map((exp, expIndex) => (
                  <div
                    key={exp.id}
                    className="p-4 border rounded-lg space-y-3 relative"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-muted-foreground">
                        Position {expIndex + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Acme Corp"
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Software Engineer"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        placeholder="San Francisco, CA (or Remote)"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        {!exp.isCurrent && (
                          <>
                            <Label>End Date</Label>
                            <Input
                              type="month"
                              value={exp.endDate}
                              onChange={(e) =>
                                updateExperience(exp.id, 'endDate', e.target.value)
                              }
                            />
                          </>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.isCurrent}
                            onChange={(e) => {
                              updateExperience(exp.id, 'isCurrent', e.target.checked);
                              if (e.target.checked) {
                                updateExperience(exp.id, 'endDate', '');
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label
                            htmlFor={`current-${exp.id}`}
                            className="text-sm text-muted-foreground"
                          >
                            Current job
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(exp.id, 'description', e.target.value)
                        }
                        placeholder="Brief overview of your role and responsibilities..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Achievements / Bullet Points</Label>
                      <div className="space-y-2 mt-1">
                        {exp.achievements.map((achievement, achIndex) => {
                          const rewriteKey = `rewrite-${exp.id}-${achIndex}`;
                          const isRewriting = aiLoading[rewriteKey];
                          return (
                            <div key={achIndex} className="flex gap-2">
                              <Input
                                value={achievement}
                                onChange={(e) => {
                                  const newAchs = [...exp.achievements];
                                  newAchs[achIndex] = e.target.value;
                                  updateExperience(exp.id, 'achievements', newAchs);
                                }}
                                placeholder="Increased revenue by 25% through..."
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                onClick={() => handleAiRewrite(exp.id, achIndex)}
                                disabled={isRewriting || !achievement.trim()}
                                title="Rewrite with AI"
                              >
                                {isRewriting ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Wand2 className="h-3.5 w-3.5" />
                                )}
                              </Button>
                              {exp.achievements.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
                                  onClick={() => {
                                    const newAchs = exp.achievements.filter(
                                      (_, i) => i !== achIndex
                                    );
                                    updateExperience(exp.id, 'achievements', newAchs);
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          updateExperience(exp.id, 'achievements', [...exp.achievements, ''])
                        }
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Achievement
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Section>

            {/* Education */}
            <Section
              title="Education"
              icon={<FileText className="h-4 w-4" />}
              isOpen={openSections.education}
              onToggle={() => toggleSection('education')}
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    addEducation();
                  }}
                  className="h-7 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              }
            >
              {resume.education.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No education added yet.
                </p>
              ) : (
                resume.education.map((edu, eduIndex) => (
                  <div
                    key={edu.id}
                    className="p-4 border rounded-lg space-y-3 relative"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-muted-foreground">
                        Education {eduIndex + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, 'institution', e.target.value)
                        }
                        placeholder="University of California, Berkeley"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(edu.id, 'degree', e.target.value)
                          }
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div>
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) =>
                            updateEducation(edu.id, 'field', e.target.value)
                          }
                          placeholder="Computer Science"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) =>
                            updateEducation(edu.id, 'startDate', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) =>
                            updateEducation(edu.id, 'endDate', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>GPA (optional)</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) =>
                            updateEducation(edu.id, 'gpa', e.target.value)
                          }
                          placeholder="3.8/4.0"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Section>

            {/* Skills */}
            <Section
              title="Skills"
              icon={<Sparkles className="h-4 w-4" />}
              isOpen={openSections.skills}
              onToggle={() => toggleSection('skills')}
            >
              <div>
                <Label>Add Skills (comma-separated)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="React, TypeScript, Node.js..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        skillInput.split(',').forEach((s) => addSkill(s));
                        setSkillInput('');
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      skillInput.split(',').forEach((s) => addSkill(s));
                      setSkillInput('');
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
              {resume.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-0.5 hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="border-t pt-4 mt-4">
                <Label>Suggest Skills from Job Description</Label>
                <Textarea
                  value={suggestionJobDesc}
                  onChange={(e) => setSuggestionJobDesc(e.target.value)}
                  placeholder="Paste a job description here to get AI-powered skill suggestions..."
                  rows={3}
                  className="mt-1"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAiSuggestSkills}
                  disabled={aiLoading.skills || !suggestionJobDesc.trim()}
                  className="mt-2"
                >
                  {aiLoading.skills ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Suggest Skills
                </Button>
              </div>
              {suggestedSkills.length > 0 && (
                <div>
                  <Label>Suggested Skills</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Click a skill to add it to your list
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          addSkill(skill);
                          setSuggestedSkills((prev) => prev.filter((s) => s !== skill));
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/40 px-3 py-1 text-sm text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* Projects */}
            <Section
              title="Projects"
              icon={<FileText className="h-4 w-4" />}
              isOpen={openSections.projects}
              onToggle={() => toggleSection('projects')}
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    addProject();
                  }}
                  className="h-7 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              }
            >
              {resume.projects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No projects added yet.
                </p>
              ) : (
                resume.projects.map((proj, projIndex) => (
                  <div
                    key={proj.id}
                    className="p-4 border rounded-lg space-y-3 relative"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-muted-foreground">
                        Project {projIndex + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeProject(proj.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={proj.name}
                          onChange={(e) =>
                            updateProject(proj.id, 'name', e.target.value)
                          }
                          placeholder="Project name"
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input
                          value={proj.url}
                          onChange={(e) =>
                            updateProject(proj.id, 'url', e.target.value)
                          }
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(proj.id, 'description', e.target.value)
                        }
                        placeholder="Brief description of the project..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Technologies (comma-separated)</Label>
                      <Input
                        value={proj.technologies}
                        onChange={(e) =>
                          updateProject(proj.id, 'technologies', e.target.value)
                        }
                        placeholder="React, Node.js, PostgreSQL"
                      />
                    </div>
                  </div>
                ))
              )}
            </Section>

            {/* Certifications */}
            <Section
              title="Certifications"
              icon={<FileText className="h-4 w-4" />}
              isOpen={openSections.certifications}
              onToggle={() => toggleSection('certifications')}
              actions={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    addCertification();
                  }}
                  className="h-7 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              }
            >
              {resume.certifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No certifications added yet.
                </p>
              ) : (
                resume.certifications.map((cert, certIndex) => (
                  <div
                    key={cert.id}
                    className="p-4 border rounded-lg space-y-3 relative"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-muted-foreground">
                        Certification {certIndex + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => removeCertification(cert.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) =>
                            updateCertification(cert.id, 'name', e.target.value)
                          }
                          placeholder="AWS Solutions Architect"
                        />
                      </div>
                      <div>
                        <Label>Issuer</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) =>
                            updateCertification(cert.id, 'issuer', e.target.value)
                          }
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="month"
                          value={cert.date}
                          onChange={(e) =>
                            updateCertification(cert.id, 'date', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Section>

            {/* Languages */}
            <Section
              title="Languages"
              icon={<FileText className="h-4 w-4" />}
              isOpen={openSections.languages}
              onToggle={() => toggleSection('languages')}
            >
              <div>
                <Label>Add Language</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g., English, Spanish"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addLanguage();
                      }
                    }}
                  />
                  <Button variant="secondary" onClick={addLanguage}>
                    Add
                  </Button>
                </div>
              </div>
              {resume.languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {resume.languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                    >
                      {lang}
                      <button
                        onClick={() => removeLanguage(lang)}
                        className="ml-0.5 hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div
          className={`${
            mobileView === 'preview' ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-1/2 overflow-y-auto bg-muted/20`}
        >
          <div className="p-4 flex justify-center">
            {previewResume && (
              <div ref={setPreviewRef} className="w-full max-w-[800px]">
                <ResumePreview
                  resume={previewResume}
                  templateId={resume.templateId}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JOB TAILORING PANEL */}
      {jobTailorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setJobTailorOpen(false);
              setJobAnalysis(null);
              setTailorSuggestions(null);
              setJobDescription('');
            }}
          />
          <div className="relative w-full max-w-lg bg-background shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Tailor to Job</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setJobTailorOpen(false);
                  setJobAnalysis(null);
                  setTailorSuggestions(null);
                  setJobDescription('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <Label>Paste Job Description</Label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={6}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleAnalyzeJob}
                  disabled={analyzingJob || !jobDescription.trim()}
                  className="flex-1"
                >
                  {analyzingJob ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Analyze Job
                </Button>
                <Button
                  onClick={handleTailorResume}
                  disabled={tailoringResume || !jobDescription.trim()}
                  className="flex-1"
                >
                  {tailoringResume ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Tailor Resume
                </Button>
              </div>

              {/* Job Analysis Results */}
              {jobAnalysis && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-medium text-sm">Job Analysis</h3>
                    {jobAnalysis.requiredSkills && jobAnalysis.requiredSkills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Required Skills
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {jobAnalysis.requiredSkills.map((skill: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {jobAnalysis.keywords && jobAnalysis.keywords.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Key Keywords
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {jobAnalysis.keywords.map((kw: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-secondary rounded"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {jobAnalysis.preferredSkills && jobAnalysis.preferredSkills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Preferred Skills
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {jobAnalysis.preferredSkills.map((skill: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-muted rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tailor Suggestions */}
              {tailorSuggestions && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-medium text-sm">Suggested Changes</h3>
                    {tailorSuggestions.summary && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Improved Summary
                        </p>
                        <p className="text-sm bg-muted/50 p-2 rounded">
                          {tailorSuggestions.summary}
                        </p>
                      </div>
                    )}
                    {tailorSuggestions.experience && tailorSuggestions.experience.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Experience Improvements
                        </p>
                        {tailorSuggestions.experience.map((exp: { achievements?: string[] }, i: number) => (
                          <div key={i} className="text-sm bg-muted/50 p-2 rounded mb-2">
                            {exp.achievements && (
                              <ul className="list-disc list-inside text-xs space-y-0.5">
                                {exp.achievements.map((ach: string, j: number) => (
                                  <li key={j}>{ach}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {tailorSuggestions.skills && tailorSuggestions.skills.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Suggested Skills to Add
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {tailorSuggestions.skills.map((skill: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={handleApplySuggestions}
                      className="w-full mt-2"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Apply Suggestions
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
