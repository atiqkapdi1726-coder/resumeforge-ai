'use client';

import React from 'react';

interface Resume {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary?: string;
  experience: Array<{
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages?: string[];
}

const printStyles = `
  @media print {
    body { margin: 0; padding: 0; }
    .resume-container { box-shadow: none !important; margin: 0 !important; max-width: 100% !important; }
    @page { margin: 0.5in; size: letter; }
  }
`;

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

function ContactLinks({ personalInfo }: { personalInfo: Resume['personalInfo'] }) {
  const links: string[] = [];
  if (personalInfo.email) links.push(personalInfo.email);
  if (personalInfo.phone) links.push(personalInfo.phone);
  if (personalInfo.location) links.push(personalInfo.location);
  return <>{links.join(' | ')}</>;
}

function ClassicATS({ resume }: { resume: Resume }) {
  return (
    <>
      <style>{printStyles}</style>
      <div
        className="resume-container bg-white p-8 max-w-3xl mx-auto shadow-lg"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        <header className="text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold mb-2">
            {resume.personalInfo.firstName} {resume.personalInfo.lastName}
          </h1>
          <div className="text-sm">
            <ContactLinks personalInfo={resume.personalInfo} />
          </div>
          {(resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website) && (
            <div className="text-sm mt-1">
              {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
              {resume.personalInfo.github && <span> | {resume.personalInfo.github}</span>}
              {resume.personalInfo.website && <span> | {resume.personalInfo.website}</span>}
            </div>
          )}
        </header>

        {resume.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Professional Summary</h2>
            <p className="text-sm leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Work Experience</h2>
            {resume.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{exp.position}</h3>
                  <span className="text-sm italic">
                    {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}
                  </span>
                </div>
                <div className="text-sm italic mb-1">
                  {exp.company}{exp.location ? `, ${exp.location}` : ''}
                </div>
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {exp.achievements.filter(a => a.trim()).map((achievement, j) => (
                      <li key={j}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {resume.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Education</h2>
            {resume.education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <span className="text-sm italic">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
                  </span>
                </div>
                <div className="text-sm italic">{edu.institution}</div>
                {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </section>
        )}

        {resume.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Skills</h2>
            <p className="text-sm">{resume.skills.join(' • ')}</p>
          </section>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Projects</h2>
            {resume.projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-bold">{proj.name}</h3>
                <p className="text-sm">{proj.description}</p>
                <p className="text-sm italic">Technologies: {proj.technologies.join(', ')}</p>
              </div>
            ))}
          </section>
        )}

        {resume.certifications && resume.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Certifications</h2>
            {resume.certifications.map((cert, i) => (
              <div key={i} className="mb-2">
                <span className="font-bold">{cert.name}</span>
                <span className="text-sm"> - {cert.issuer}, {cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {resume.languages && resume.languages.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-black pb-1 mb-3">Languages</h2>
            <p className="text-sm">{resume.languages.join(' • ')}</p>
          </section>
        )}
      </div>
    </>
  );
}

function ModernProfessional({ resume }: { resume: Resume }) {
  return (
    <>
      <style>{printStyles}</style>
      <div
        className="resume-container bg-white max-w-3xl mx-auto shadow-lg"
        style={{ fontFamily: '"Segoe UI", Roboto, sans-serif' }}
      >
        <header className="bg-slate-800 text-white px-8 py-6">
          <h1 className="text-3xl font-light tracking-wide">
            {resume.personalInfo.firstName} {resume.personalInfo.lastName}
          </h1>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-200">
            {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
            {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
            {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
          </div>
          {(resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website) && (
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-slate-300">
              {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
              {resume.personalInfo.github && <span>{resume.personalInfo.github}</span>}
              {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
            </div>
          )}
        </header>

        <div className="px-8 py-6">
          {resume.summary && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Summary</h2>
              <p className="text-sm leading-relaxed text-gray-700">{resume.summary}</p>
            </section>
          )}

          {resume.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Experience</h2>
              {resume.experience.map((exp, i) => (
                <div key={i} className="mb-4 pl-4 border-l-2 border-slate-300">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 font-medium">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</div>
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                      {exp.achievements.filter(a => a.trim()).map((achievement, j) => (
                        <li key={j}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {resume.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Education</h2>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb-3 pl-4 border-l-2 border-slate-300">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-slate-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">{edu.institution}</div>
                  {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </section>
          )}

          {resume.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Projects</h2>
              {resume.projects.map((proj, i) => (
                <div key={i} className="mb-3 pl-4 border-l-2 border-slate-300">
                  <h3 className="font-semibold text-slate-900">{proj.name}</h3>
                  <p className="text-sm text-gray-700">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((tech, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 bg-slate-800 text-white rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {resume.certifications && resume.certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Certifications</h2>
              <div className="space-y-1">
                {resume.certifications.map((cert, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-semibold">{cert.name}</span>
                    <span className="text-gray-500"> — {cert.issuer}, {cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.languages && resume.languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Languages</h2>
              <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                {resume.languages.map((lang, i) => (
                  <span key={i}>{lang}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function Executive({ resume }: { resume: Resume }) {
  return (
    <>
      <style>{printStyles}</style>
      <div
        className="resume-container bg-white max-w-3xl mx-auto shadow-lg"
        style={{ fontFamily: '"Georgia", serif' }}
      >
        <header className="px-10 pt-8 pb-4 border-b border-gray-300">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {resume.personalInfo.firstName} {resume.personalInfo.lastName}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
            {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
            {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
            {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
            {resume.personalInfo.github && <span>{resume.personalInfo.github}</span>}
            {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
          </div>
        </header>

        <div className="px-10 py-6">
          {resume.summary && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Executive Summary</h2>
              <p className="text-sm leading-relaxed text-gray-700 border-l-2 border-gray-800 pl-4">{resume.summary}</p>
            </section>
          )}

          {resume.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Professional Experience</h2>
              {resume.experience.map((exp, i) => (
                <div key={i} className="mb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                      <div className="text-sm text-gray-600">{exp.company}</div>
                      {exp.location && <div className="text-xs text-gray-500">{exp.location}</div>}
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>{formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}</div>
                    </div>
                  </div>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.achievements.filter(a => a.trim()).map((achievement, j) => (
                        <li key={j} className="text-sm text-gray-700 flex">
                          <span className="text-gray-400 mr-2">▸</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {resume.education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Education</h2>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</h3>
                    <span className="text-xs text-gray-500">{formatDate(edu.startDate)} — {formatDate(edu.endDate || '')}</span>
                  </div>
                  <div className="text-sm text-gray-600">{edu.institution}</div>
                  {edu.gpa && <div className="text-xs text-gray-500 mt-0.5">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </section>
          )}

          {resume.skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Core Competencies</h2>
              <div className="grid grid-cols-2 gap-1">
                {resume.skills.map((skill, i) => (
                  <div key={i} className="text-sm text-gray-700 py-0.5">
                    ◆ {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Key Projects</h2>
              {resume.projects.map((proj, i) => (
                <div key={i} className="mb-3">
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
                  <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Technologies: {proj.technologies.join(', ')}</p>
                </div>
              ))}
            </section>
          )}

          {resume.certifications && resume.certifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Certifications</h2>
              <div className="space-y-1">
                {resume.certifications.map((cert, i) => (
                  <div key={i} className="text-sm text-gray-700">
                    {cert.name} — <span className="text-gray-500">{cert.issuer}, {cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.languages && resume.languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Languages</h2>
              <p className="text-sm text-gray-700">{resume.languages.join(' | ')}</p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function Minimal({ resume }: { resume: Resume }) {
  return (
    <>
      <style>{printStyles}</style>
      <div
        className="resume-container bg-white max-w-3xl mx-auto shadow-lg px-10 py-8"
        style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
      >
        <header className="mb-8">
          <h1 className="text-2xl font-light text-gray-900">
            {resume.personalInfo.firstName} {resume.personalInfo.lastName}
          </h1>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
            {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
            {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
            {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
            {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
            {resume.personalInfo.github && <span>{resume.personalInfo.github}</span>}
            {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
          </div>
        </header>

        {resume.summary && (
          <section className="mb-6">
            <p className="text-sm text-gray-600 leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">Experience</h2>
            {resume.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium text-gray-900">{exp.position}</h3>
                  <span className="text-xs text-gray-400">
                    {formatDate(exp.startDate)} – {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                {exp.achievements.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.achievements.filter(a => a.trim()).map((achievement, j) => (
                      <li key={j} className="text-xs text-gray-600 leading-relaxed">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {resume.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">Education</h2>
            {resume.education.map((edu, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                  <span className="text-xs text-gray-400">{formatDate(edu.startDate)} – {formatDate(edu.endDate || '')}</span>
                </div>
                <div className="text-xs text-gray-500">{edu.institution}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
              </div>
            ))}
          </section>
        )}

        {resume.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">Skills</h2>
            <p className="text-xs text-gray-600 leading-relaxed">{resume.skills.join(', ')}</p>
          </section>
        )}

        {resume.projects && resume.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">Projects</h2>
            {resume.projects.map((proj, i) => (
              <div key={i} className="mb-2">
                <h3 className="text-sm font-medium text-gray-900">{proj.name}</h3>
                <p className="text-xs text-gray-600">{proj.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">{proj.technologies.join(' • ')}</p>
              </div>
            ))}
          </section>
        )}

        {resume.certifications && resume.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">Certifications</h2>
            <div className="space-y-0.5">
              {resume.certifications.map((cert, i) => (
                <div key={i} className="text-xs text-gray-600">
                  {cert.name} — {cert.issuer}, {cert.date}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.languages && resume.languages.length > 0 && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">Languages</h2>
            <p className="text-xs text-gray-600">{resume.languages.join(', ')}</p>
          </section>
        )}
      </div>
    </>
  );
}

function Graduate({ resume }: { resume: Resume }) {
  return (
    <>
      <style>{printStyles}</style>
      <div
        className="resume-container bg-white max-w-3xl mx-auto shadow-lg"
        style={{ fontFamily: '"Garamond", "Palatino", serif' }}
      >
        <header className="text-center px-8 pt-8 pb-5 border-b-4 border-indigo-700">
          <h1 className="text-3xl font-bold text-indigo-900">
            {resume.personalInfo.firstName} {resume.personalInfo.lastName}
          </h1>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
            {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
            {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
            {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
          </div>
          {(resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website) && (
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1 text-xs text-indigo-600">
              {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
              {resume.personalInfo.github && <span>{resume.personalInfo.github}</span>}
              {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
            </div>
          )}
        </header>

        <div className="px-8 py-6">
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase text-indigo-700 mb-2">Objective</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {resume.summary || 'Motivated recent graduate seeking opportunities to apply academic knowledge and skills in a professional environment.'}
            </p>
          </section>

          {resume.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase text-indigo-700 mb-3">Education</h2>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb-4 p-3 bg-indigo-50 rounded">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{edu.institution}</div>
                  {edu.gpa && <div className="text-xs text-indigo-600 mt-1">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </section>
          )}

          {resume.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase text-indigo-700 mb-3">Experience</h2>
              {resume.experience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate || '')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                      {exp.achievements.filter(a => a.trim()).map((achievement, j) => (
                        <li key={j}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase text-indigo-700 mb-3">Academic Projects</h2>
              {resume.projects.map((proj, i) => (
                <div key={i} className="mb-3">
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
                  <p className="text-sm text-gray-700">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((tech, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {resume.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase text-indigo-700 mb-3">Skills</h2>
              <div className="grid grid-cols-2 gap-2">
                {resume.skills.map((skill, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-700">
                    <span className="text-indigo-500 mr-2">●</span>
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.certifications && resume.certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold uppercase text-indigo-700 mb-3">Certifications</h2>
              {resume.certifications.map((cert, i) => (
                <div key={i} className="mb-1 text-sm">
                  <span className="font-semibold">{cert.name}</span>
                  <span className="text-gray-500"> — {cert.issuer}, {cert.date}</span>
                </div>
              ))}
            </section>
          )}

          {resume.languages && resume.languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase text-indigo-700 mb-3">Languages</h2>
              <p className="text-sm text-gray-700">{resume.languages.join(' | ')}</p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function Technical({ resume }: { resume: Resume }) {
  return (
    <>
      <style>{printStyles}</style>
      <div
        className="resume-container bg-white max-w-3xl mx-auto shadow-lg"
        style={{ fontFamily: '"Fira Code", "Source Code Pro", monospace' }}
      >
        <header className="bg-gray-900 text-green-400 px-8 py-5">
          <h1 className="text-2xl font-bold">
            <span className="text-white">{'>'}</span> {resume.personalInfo.firstName}_{resume.personalInfo.lastName}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
            {resume.personalInfo.email && <span>📧 {resume.personalInfo.email}</span>}
            {resume.personalInfo.phone && <span>📱 {resume.personalInfo.phone}</span>}
            {resume.personalInfo.location && <span>📍 {resume.personalInfo.location}</span>}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1 text-xs text-gray-400">
            {resume.personalInfo.linkedin && <span>🔗 {resume.personalInfo.linkedin}</span>}
            {resume.personalInfo.github && <span>💻 {resume.personalInfo.github}</span>}
            {resume.personalInfo.website && <span>🌐 {resume.personalInfo.website}</span>}
          </div>
        </header>

        <div className="px-8 py-6" style={{ fontFamily: 'monospace' }}>
          {resume.summary && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b border-dashed border-gray-300 pb-1">
                # About
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded">
                {resume.summary}
              </p>
            </section>
          )}

          {resume.skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b border-dashed border-gray-300 pb-1">
                # Technical Skills
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {resume.skills.map((skill, i) => (
                  <div key={i} className="text-xs bg-gray-900 text-green-400 px-3 py-1.5 rounded">
                    <span className="text-gray-500">$</span> {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b border-dashed border-gray-300 pb-1">
                # Work Experience
              </h2>
              {resume.experience.map((exp, i) => (
                <div key={i} className="mb-4 pl-4 border-l-2 border-green-400">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-xs text-gray-400">
                      [{formatDate(exp.startDate)} → {exp.isCurrent ? 'now' : formatDate(exp.endDate || '')}]
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">@ {exp.company}{exp.location ? ` (${exp.location})` : ''}</div>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.achievements.filter(a => a.trim()).map((achievement, j) => (
                        <li key={j} className="text-xs text-gray-700 flex">
                          <span className="text-green-500 mr-2">▸</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {resume.projects && resume.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b border-dashed border-gray-300 pb-1">
                # Projects
              </h2>
              {resume.projects.map((proj, i) => (
                <div key={i} className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900">{proj.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((tech, j) => (
                      <span key={j} className="text-xs px-2 py-0.5 bg-gray-800 text-green-300 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {resume.education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b border-dashed border-gray-300 pb-1">
                # Education
              </h2>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <span className="text-xs text-gray-400">
                      [{formatDate(edu.startDate)} → {formatDate(edu.endDate || '')}]
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{edu.institution}</div>
                  {edu.gpa && <div className="text-xs text-gray-500 mt-0.5">gpa: {edu.gpa}</div>}
                </div>
              ))}
            </section>
          )}

          {resume.certifications && resume.certifications.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b border-dashed border-gray-300 pb-1">
                # Certifications
              </h2>
              <div className="space-y-1">
                {resume.certifications.map((cert, i) => (
                  <div key={i} className="text-xs text-gray-700">
                    <span className="text-green-600">✓</span> {cert.name} — {cert.issuer} ({cert.date})
                  </div>
                ))}
              </div>
            </section>
          )}

          {resume.languages && resume.languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b border-dashed border-gray-300 pb-1">
                # Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {resume.languages.map((lang, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-300">
                    {lang}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

const templates: Record<string, React.FC<{ resume: Resume }>> = {
  'classic-ats': ClassicATS,
  'modern-professional': ModernProfessional,
  'executive': Executive,
  'minimal': Minimal,
  'graduate': Graduate,
  'technical': Technical,
};

export function getTemplateComponent(templateId: string): React.FC<{ resume: Resume }> {
  return templates[templateId] || ModernProfessional;
}

export function ResumePreview({ resume, templateId }: { resume: Resume; templateId: string }) {
  const TemplateComponent = getTemplateComponent(templateId);
  return <TemplateComponent resume={resume} />;
}

export { ClassicATS, ModernProfessional, Executive, Minimal, Graduate, Technical };
export type { Resume };
