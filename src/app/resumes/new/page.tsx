'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Plus, Trash2, Eye } from 'lucide-react';
import { Resume, Experience, Education, Skill } from '@/types';
import { generateId } from '@/lib/utils';

const emptyResume: Resume = {
  id: '',
  userId: '',
  title: 'Untitled Resume',
  templateId: 'modern',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublic: false,
};

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [resume, setResume] = useState<Resume>(emptyResume);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });
      if (response.ok) {
        const data = await response.json();
        setResume(data.resume);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to save resume:', error);
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
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
    setResume({ ...resume, experience: [...resume.experience, newExp] });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    setResume({ ...resume, education: [...resume.education, newEdu] });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setResume({
      ...resume,
      education: resume.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    setResume({
      ...resume,
      education: resume.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      category: 'technical',
    };
    setResume({ ...resume, skills: [...resume.skills, newSkill] });
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setResume({
      ...resume,
      skills: resume.skills.map((skill) =>
        skill.id === id ? { ...skill, ...updates } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    setResume({
      ...resume,
      skills: resume.skills.filter((skill) => skill.id !== id),
    });
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Input
            value={resume.title}
            onChange={(e) => setResume({ ...resume, title: e.target.value })}
            className="text-xl font-bold border-none focus-visible:ring-0 w-64"
            placeholder="Resume Title"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="max-w-3xl mx-auto bg-white shadow-lg p-8">
          {/* Preview */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {resume.personalInfo.firstName} {resume.personalInfo.lastName}
            </h1>
            <div className="flex gap-4 text-sm text-gray-600 mt-2">
              {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
              {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
              {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
            </div>
          </div>

          {resume.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b pb-1 mb-2">Summary</h2>
              <p className="text-sm">{resume.summary}</p>
            </div>
          )}

          {resume.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h2>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{exp.position}</h3>
                      <p className="text-sm">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside mt-2 text-sm">
                      {exp.achievements.filter(a => a).map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {resume.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b pb-1 mb-2">Education</h2>
              {resume.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                      <p className="text-sm">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {resume.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span key={skill.id} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={resume.personalInfo.firstName}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, firstName: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={resume.personalInfo.lastName}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, lastName: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={resume.personalInfo.email}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, email: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={resume.personalInfo.phone}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, phone: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={resume.personalInfo.location}
                  onChange={(e) =>
                    setResume({
                      ...resume,
                      personalInfo: { ...resume.personalInfo, location: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">LinkedIn</label>
                  <Input
                    value={resume.personalInfo.linkedin}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, linkedin: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    value={resume.personalInfo.website}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personalInfo: { ...resume.personalInfo, website: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                placeholder="Write a brief summary of your professional background..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Experience</CardTitle>
              <Button size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium">Position</label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        disabled={exp.isCurrent}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Achievements</label>
                    {exp.achievements.map((achievement, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          value={achievement}
                          onChange={(e) => {
                            const newAchievements = [...exp.achievements];
                            newAchievements[index] = e.target.value;
                            updateExperience(exp.id, { achievements: newAchievements });
                          }}
                          placeholder="Describe your achievement..."
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newAchievements = exp.achievements.filter((_, i) => i !== index);
                            updateExperience(exp.id, { achievements: newAchievements });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        updateExperience(exp.id, {
                          achievements: [...exp.achievements, ''],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </Button>
                  </div>
                </div>
              ))}
              {resume.experience.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No experience added yet. Click &quot;Add&quot; to get started.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium">Institution</label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Field of Study</label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {resume.education.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No education added yet. Click &quot;Add&quot; to get started.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
              <Button size="sm" onClick={addSkill}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {resume.skills.map((skill) => (
                  <div key={skill.id} className="flex gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                      placeholder="Skill name"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) =>
                        updateSkill(skill.id, { category: e.target.value as Skill['category'] })
                      }
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="technical">Technical</option>
                      <option value="soft">Soft</option>
                      <option value="language">Language</option>
                      <option value="other">Other</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {resume.skills.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No skills added yet. Click &quot;Add&quot; to get started.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
