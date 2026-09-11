'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn, generateId } from '@/lib/utils';
import {
  Loader2,
  Plus,
  Trash2,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AIWizardProps {
  onComplete: (resumeData: any) => void;
  onCancel: () => void;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

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

const TOTAL_STEPS = 7;

const EXPERIENCE_OPTIONS = [
  { value: '0-1', label: '0-1 years' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
];

function createEmptyExperience(): Experience {
  return {
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
}

function createEmptyEducation(): Education {
  return {
    id: generateId(),
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
  };
}

function createEmptyProject(): Project {
  return {
    id: generateId(),
    name: '',
    description: '',
    technologies: '',
    url: '',
  };
}

function createEmptyCertification(): Certification {
  return {
    id: generateId(),
    name: '',
    issuer: '',
    date: '',
  };
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-foreground mb-1.5">
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

export default function AIWizard({ onComplete, onCancel }: AIWizardProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
  });

  const [career, setCareer] = useState({
    targetJobTitle: '',
    industry: '',
    yearsOfExperience: '',
    currentRole: '',
  });

  const [experiences, setExperiences] = useState<Experience[]>([createEmptyExperience()]);
  const [educations, setEducations] = useState<Education[]>([createEmptyEducation()]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [skillJobDescription, setSkillJobDescription] = useState('');
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementInput, setAchievementInput] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState('');

  const [rewritingId, setRewritingId] = useState<string | null>(null);

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const updateCareer = useCallback((field: string, value: string) => {
    setCareer((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const updateExperience = useCallback((id: string, field: keyof Experience, value: any) => {
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }, []);

  const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
    setEducations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }, []);

  const updateProject = useCallback((id: string, field: keyof Project, value: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }, []);

  const updateCertification = useCallback((id: string, field: keyof Certification, value: string) => {
    setCertifications((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }, []);

  const addSkill = useCallback(
    (skill: string) => {
      const trimmed = skill.trim();
      if (trimmed && !skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
        setSkills((prev) => [...prev, trimmed]);
      }
    },
    [skills]
  );

  const removeSkill = useCallback((skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }, []);

  const addAchievement = useCallback(() => {
    const trimmed = achievementInput.trim();
    if (trimmed) {
      setAchievements((prev) => [...prev, trimmed]);
      setAchievementInput('');
    }
  }, [achievementInput]);

  const removeAchievement = useCallback((index: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addLanguage = useCallback(() => {
    const trimmed = languageInput.trim();
    if (trimmed && !languages.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      setLanguages((prev) => [...prev, trimmed]);
      setLanguageInput('');
    }
  }, [languageInput, languages]);

  const removeLanguage = useCallback((lang: string) => {
    setLanguages((prev) => prev.filter((l) => l !== lang));
  }, []);

  const handleSuggestSkills = useCallback(async () => {
    if (!skillJobDescription.trim()) return;
    setLoadingSkills(true);
    try {
      const res = await fetch('/api/ai/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: skillJobDescription, currentSkills: skills }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to suggest skills');
      setSuggestedSkills(data.result || []);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, skillSuggestion: err.message }));
    } finally {
      setLoadingSkills(false);
    }
  }, [skillJobDescription, skills]);

  const handleRewriteAchievement = useCallback(
    async (experienceId: string, achievementIndex: number) => {
      const exp = experiences.find((e) => e.id === experienceId);
      if (!exp) return;
      const bullet = exp.achievements[achievementIndex];
      if (!bullet?.trim()) return;

      setRewritingId(`${experienceId}-${achievementIndex}`);
      try {
        const res = await fetch('/api/ai/rewrite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            position: exp.position,
            company: exp.company,
            achievements: [bullet],
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to rewrite');
        const rewritten = data.result?.[0] || bullet;
        setExperiences((prev) =>
          prev.map((e) => {
            if (e.id !== experienceId) return e;
            const newAchievements = [...e.achievements];
            newAchievements[achievementIndex] = rewritten;
            return { ...e, achievements: newAchievements };
          })
        );
      } catch (err: any) {
        setErrors((prev) => ({
          ...prev,
          [`rewrite-${experienceId}-${achievementIndex}`]: err.message,
        }));
      } finally {
        setRewritingId(null);
      }
    },
    [experiences]
  );

  const validateStep = useCallback(
    (stepNum: number): boolean => {
      const newErrors: Record<string, string> = {};

      if (stepNum === 1) {
        if (!personalInfo.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!personalInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!personalInfo.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email))
          newErrors.email = 'Invalid email format';
      }

      if (stepNum === 2) {
        if (!career.targetJobTitle.trim()) newErrors.targetJobTitle = 'Target job title is required';
      }

      if (stepNum === 3) {
        experiences.forEach((exp, i) => {
          if (!exp.company.trim()) newErrors[`exp-${exp.id}-company`] = 'Company is required';
          if (!exp.position.trim()) newErrors[`exp-${exp.id}-position`] = 'Position is required';
          if (!exp.startDate) newErrors[`exp-${exp.id}-startDate`] = 'Start date is required';
          if (!exp.isCurrent && !exp.endDate)
            newErrors[`exp-${exp.id}-endDate`] = 'End date is required';
        });
      }

      if (stepNum === 4) {
        educations.forEach((edu) => {
          if (!edu.institution.trim())
            newErrors[`edu-${edu.id}-institution`] = 'Institution is required';
          if (!edu.degree.trim()) newErrors[`edu-${edu.id}-degree`] = 'Degree is required';
          if (!edu.startDate) newErrors[`edu-${edu.id}-startDate`] = 'Start date is required';
        });
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [personalInfo, career, experiences, educations]
  );

  const handleNext = useCallback(() => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  }, [step, validateStep]);

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setGenerateError('');
    try {
      const input = {
        personalInfo: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          phone: personalInfo.phone || undefined,
          location: personalInfo.location || undefined,
          linkedin: personalInfo.linkedin || undefined,
          github: personalInfo.github || undefined,
          website: personalInfo.website || undefined,
        },
        targetJobTitle: career.targetJobTitle || undefined,
        industry: career.industry || undefined,
        yearsOfExperience: career.yearsOfExperience || undefined,
        currentRole: career.currentRole || undefined,
        experience: experiences.map((e) => ({
          company: e.company,
          position: e.position,
          location: e.location || undefined,
          startDate: e.startDate,
          endDate: e.isCurrent ? undefined : e.endDate || undefined,
          isCurrent: e.isCurrent,
          description: e.description || undefined,
          achievements: e.achievements.filter((a) => a.trim()),
        })),
        education: educations.map((e) => ({
          institution: e.institution,
          degree: e.degree,
          field: e.field || undefined,
          startDate: e.startDate,
          endDate: e.endDate || undefined,
          gpa: e.gpa || undefined,
        })),
        skills,
        projects: projects.length > 0 ? projects.map((p) => ({
          name: p.name,
          description: p.description,
          technologies: p.technologies.split(',').map((t) => t.trim()).filter(Boolean),
          url: p.url || undefined,
        })) : undefined,
        certifications: certifications.length > 0 ? certifications.map((c) => ({
          name: c.name,
          issuer: c.issuer,
          date: c.date,
        })) : undefined,
        achievements: achievements.length > 0 ? achievements : undefined,
        languages: languages.length > 0 ? languages : undefined,
      };

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, action: 'generate-full' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate resume');

      const aiResult = data.result;
      const resumeData = {
        ...input,
        summary: aiResult.summary || '',
        experience: input.experience.map((exp, i) => ({
          ...exp,
          achievements: aiResult.experience?.[i]?.achievements || exp.achievements,
        })),
        skills: aiResult.skills || input.skills,
      };

      onComplete(resumeData);
    } catch (err: any) {
      setGenerateError(err.message || 'An unexpected error occurred');
    } finally {
      setGenerating(false);
    }
  }, [
    personalInfo,
    career,
    experiences,
    educations,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    onComplete,
  ]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>First Name</Label>
                <Input
                  value={personalInfo.firstName}
                  onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                  placeholder="John"
                />
                <FieldError message={errors.firstName} />
              </div>
              <div>
                <Label required>Last Name</Label>
                <Input
                  value={personalInfo.lastName}
                  onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                  placeholder="Doe"
                />
                <FieldError message={errors.lastName} />
              </div>
            </div>
            <div>
              <Label>Professional Title</Label>
              <Input
                value={personalInfo.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                placeholder="Senior Software Engineer"
              />
            </div>
            <div>
              <Label required>Email</Label>
              <Input
                type="email"
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="john@example.com"
              />
              <FieldError message={errors.email} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <Input
                value={personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>GitHub URL</Label>
                <Input
                  value={personalInfo.github}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  placeholder="https://github.com/johndoe"
                />
              </div>
              <div>
                <Label>Website / Portfolio</Label>
                <Input
                  value={personalInfo.website}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  placeholder="https://johndoe.dev"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label required>Target Job Title</Label>
              <Input
                value={career.targetJobTitle}
                onChange={(e) => updateCareer('targetJobTitle', e.target.value)}
                placeholder="Senior Software Engineer"
              />
              <FieldError message={errors.targetJobTitle} />
            </div>
            <div>
              <Label>Industry</Label>
              <Input
                value={career.industry}
                onChange={(e) => updateCareer('industry', e.target.value)}
                placeholder="Technology / Software"
              />
            </div>
            <div>
              <Label>Years of Experience</Label>
              <select
                value={career.yearsOfExperience}
                onChange={(e) => updateCareer('yearsOfExperience', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select experience level</option>
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Current / Previous Role</Label>
              <Input
                value={career.currentRole}
                onChange={(e) => updateCareer('currentRole', e.target.value)}
                placeholder="Software Engineer at Acme Corp"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {experiences.map((exp, expIndex) => (
              <Card key={exp.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Experience {expIndex + 1}</CardTitle>
                    {experiences.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExperiences((prev) => prev.filter((e) => e.id !== exp.id))
                        }
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label required>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Acme Corp"
                      />
                      <FieldError message={errors[`exp-${exp.id}-company`]} />
                    </div>
                    <div>
                      <Label required>Job Title</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        placeholder="Software Engineer"
                      />
                      <FieldError message={errors[`exp-${exp.id}-position`]} />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label required>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      />
                      <FieldError message={errors[`exp-${exp.id}-startDate`]} />
                    </div>
                    <div>
                      {!exp.isCurrent && (
                        <>
                          <Label required>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          />
                          <FieldError message={errors[`exp-${exp.id}-endDate`]} />
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
                        <label htmlFor={`current-${exp.id}`} className="text-sm text-muted-foreground">
                          Current job
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Brief overview of your role and responsibilities..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Achievements / Bullet Points</Label>
                    <div className="space-y-2 mt-1">
                      {exp.achievements.map((achievement, achIndex) => {
                        const rewriteKey = `rewrite-${exp.id}-${achIndex}`;
                        const isRewriting = rewritingId === `${exp.id}-${achIndex}`;
                        return (
                          <div key={achIndex} className="flex gap-2">
                            <Input
                              value={achievement}
                              onChange={(e) => {
                                const newAchievements = [...exp.achievements];
                                newAchievements[achIndex] = e.target.value;
                                updateExperience(exp.id, 'achievements', newAchievements);
                              }}
                              placeholder="Increased revenue by 25% through..."
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRewriteAchievement(exp.id, achIndex)}
                              disabled={isRewriting || !achievement.trim()}
                              title="Rewrite with AI"
                            >
                              {isRewriting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Wand2 className="h-4 w-4" />
                              )}
                            </Button>
                            {exp.achievements.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newAchievements = exp.achievements.filter(
                                    (_, i) => i !== achIndex
                                  );
                                  updateExperience(exp.id, 'achievements', newAchievements);
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
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
                      onClick={() =>
                        updateExperience(exp.id, 'achievements', [...exp.achievements, ''])
                      }
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Achievement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setExperiences((prev) => [...prev, createEmptyExperience()])}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Job
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {educations.map((edu, eduIndex) => (
              <Card key={edu.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Education {eduIndex + 1}</CardTitle>
                    {educations.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEducations((prev) => prev.filter((e) => e.id !== edu.id))
                        }
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label required>Institution Name</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="University of California, Berkeley"
                    />
                    <FieldError message={errors[`edu-${edu.id}-institution`]} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label required>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Bachelor of Science"
                      />
                      <FieldError message={errors[`edu-${edu.id}-degree`]} />
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label required>Start Date</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      />
                      <FieldError message={errors[`edu-${edu.id}-startDate`]} />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>GPA (optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        placeholder="3.8/4.0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setEducations((prev) => [...prev, createEmptyEducation()])}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Education
            </Button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Add Skills (comma-separated)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="React, TypeScript, Node.js, Python..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      skillInput.split(',').forEach((s) => addSkill(s));
                      setSkillInput('');
                    }
                  }}
                />
                <Button
                  type="button"
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

            {skills.length > 0 && (
              <div>
                <Label>Current Skills</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {skills.map((skill) => (
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
              </div>
            )}

            <div className="border-t pt-4">
              <Label>Suggest Skills from Job Description</Label>
              <Textarea
                value={skillJobDescription}
                onChange={(e) => setSkillJobDescription(e.target.value)}
                placeholder="Paste a job description here to get AI-powered skill suggestions..."
                rows={4}
                className="mt-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleSuggestSkills}
                disabled={loadingSkills || !skillJobDescription.trim()}
                className="mt-2"
              >
                {loadingSkills ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Suggest Skills
              </Button>
              {errors.skillSuggestion && (
                <p className="text-xs text-destructive mt-1">{errors.skillSuggestion}</p>
              )}
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
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            {/* Projects */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Projects</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setProjects((prev) => [...prev, createEmptyProject()])}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {projects.map((project, i) => (
                <Card key={project.id} className="mb-3">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                          placeholder="Project name"
                        />
                        <Input
                          value={project.url}
                          onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setProjects((prev) => prev.filter((p) => p.id !== project.id))}
                        className="text-destructive hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      placeholder="Brief description of the project..."
                      rows={2}
                    />
                    <Input
                      value={project.technologies}
                      onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                      placeholder="Technologies used (comma-separated)"
                    />
                  </CardContent>
                </Card>
              ))}
              {projects.length === 0 && (
                <p className="text-sm text-muted-foreground">No projects added yet.</p>
              )}
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Certifications</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCertifications((prev) => [...prev, createEmptyCertification()])}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {certifications.map((cert) => (
                <Card key={cert.id} className="mb-3">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 grid grid-cols-3 gap-3">
                        <Input
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                          placeholder="Certification name"
                        />
                        <Input
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                          placeholder="Issuing organization"
                        />
                        <Input
                          type="month"
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setCertifications((prev) => prev.filter((c) => c.id !== cert.id))
                        }
                        className="text-destructive hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {certifications.length === 0 && (
                <p className="text-sm text-muted-foreground">No certifications added yet.</p>
              )}
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Key Achievements</h3>
              <div className="flex gap-2">
                <Input
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  placeholder="e.g., Won Employee of the Year award"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAchievement();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addAchievement}>
                  Add
                </Button>
              </div>
              {achievements.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {achievements.map((ach, i) => (
                    <li key={i} className="flex items-center justify-between text-sm rounded-md bg-muted px-3 py-1.5">
                      <span>{ach}</span>
                      <button
                        onClick={() => removeAchievement(i)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Languages</h3>
              <div className="flex gap-2">
                <Input
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  placeholder="e.g., English, Spanish"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addLanguage();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addLanguage}>
                  Add
                </Button>
              </div>
              {languages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map((lang) => (
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
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resume Summary</CardTitle>
                <CardDescription>Review your information before generating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-foreground">Personal Information</h4>
                  <p className="text-muted-foreground mt-1">
                    {personalInfo.firstName} {personalInfo.lastName}
                    {personalInfo.title && ` — ${personalInfo.title}`}
                  </p>
                  <p className="text-muted-foreground">{personalInfo.email}</p>
                  {personalInfo.phone && <p className="text-muted-foreground">{personalInfo.phone}</p>}
                  {personalInfo.location && (
                    <p className="text-muted-foreground">{personalInfo.location}</p>
                  )}
                  <div className="flex gap-3 mt-1 text-muted-foreground">
                    {personalInfo.linkedin && (
                      <span className="truncate max-w-[200px]">{personalInfo.linkedin}</span>
                    )}
                    {personalInfo.github && (
                      <span className="truncate max-w-[200px]">{personalInfo.github}</span>
                    )}
                    {personalInfo.website && (
                      <span className="truncate max-w-[200px]">{personalInfo.website}</span>
                    )}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-medium text-foreground">Career Target</h4>
                  <p className="text-muted-foreground mt-1">
                    {career.targetJobTitle}
                    {career.industry && ` in ${career.industry}`}
                    {career.yearsOfExperience && ` • ${career.yearsOfExperience} experience`}
                  </p>
                  {career.currentRole && (
                    <p className="text-muted-foreground">{career.currentRole}</p>
                  )}
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-medium text-foreground">
                    Work Experience ({experiences.length})
                  </h4>
                  {experiences.map((exp) => (
                    <div key={exp.id} className="mt-2">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">{exp.position}</span> at{' '}
                        {exp.company}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                      {exp.achievements.filter(Boolean).length > 0 && (
                        <ul className="mt-1 ml-4 list-disc text-xs text-muted-foreground space-y-0.5">
                          {exp.achievements.filter(Boolean).map((ach, i) => (
                            <li key={i}>{ach}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-medium text-foreground">
                    Education ({educations.length})
                  </h4>
                  {educations.map((edu) => (
                    <p key={edu.id} className="text-muted-foreground mt-1">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`} — {edu.institution}
                      {edu.gpa && ` (GPA: ${edu.gpa})`}
                    </p>
                  ))}
                </div>

                {skills.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-foreground">Skills</h4>
                    <p className="text-muted-foreground mt-1">{skills.join(', ')}</p>
                  </div>
                )}

                {projects.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-foreground">
                      Projects ({projects.length})
                    </h4>
                    {projects.map((p) => (
                      <p key={p.id} className="text-muted-foreground mt-1">
                        {p.name}
                        {p.technologies && ` — ${p.technologies}`}
                      </p>
                    ))}
                  </div>
                )}

                {certifications.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-foreground">
                      Certifications ({certifications.length})
                    </h4>
                    {certifications.map((c) => (
                      <p key={c.id} className="text-muted-foreground mt-1">
                        {c.name} — {c.issuer}
                      </p>
                    ))}
                  </div>
                )}

                {achievements.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-foreground">Key Achievements</h4>
                    <ul className="mt-1 ml-4 list-disc text-muted-foreground space-y-0.5">
                      {achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {languages.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-foreground">Languages</h4>
                    <p className="text-muted-foreground mt-1">{languages.join(', ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {generateError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {generateError}
              </div>
            )}

            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Your Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate My Resume with AI
                </>
              )}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Create Resume with AI</h2>
          <span className="text-sm text-muted-foreground">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">{renderStep()}</CardContent>
      </Card>

      <div className="flex items-center justify-between mt-6">
        <div>
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          {step < TOTAL_STEPS && (
            <Button type="button" onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
