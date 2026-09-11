'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Eye } from 'lucide-react';
import { TEMPLATES } from '@/config';
import { cn } from '@/lib/utils';

const templatePreviews = {
  classic: {
    name: 'Classic ATS',
    description: 'Traditional single-column layout with Times New Roman. Safe, clean, and universally accepted by ATS systems.',
    color: 'from-gray-700 to-gray-900',
    sections: ['Centered Header', 'Single Column', 'Standard Sections', 'Clean Lines'],
  },
  modern: {
    name: 'Modern Professional',
    description: 'Dark header bar with accent colors. Clean sections with left-bordered headings and pill-shaped skill tags.',
    color: 'from-blue-600 to-indigo-700',
    sections: ['Dark Header', 'Bordered Sections', 'Color Accents', 'Pill Skills'],
  },
  executive: {
    name: 'Executive',
    description: 'Georgia serif font with formal styling. Ultra-wide letter-spaced headings and structured hierarchy.',
    color: 'from-slate-800 to-slate-900',
    sections: ['Serif Font', 'Wide Headings', 'Arrow Bullets', 'Two-Column Skills'],
  },
  minimal: {
    name: 'Minimal',
    description: 'Ultra-clean Helvetica Neue design with minimal borders. Let your content speak for itself.',
    color: 'from-gray-400 to-gray-600',
    sections: ['Light Font Weights', 'Minimal Borders', 'Compact Spacing', 'Muted Tones'],
  },
  graduate: {
    name: 'Graduate',
    description: 'Designed for fresh graduates. Education-focused layout with Garamond serif and indigo accents.',
    color: 'from-indigo-500 to-purple-600',
    sections: ['Education First', 'Garamond Serif', 'Indigo Accent', 'Highlight Boxes'],
  },
  technical: {
    name: 'Technical',
    description: 'Skills-heavy, project-focused layout. Monospace font with terminal-inspired dark header.',
    color: 'from-emerald-600 to-teal-700',
    sections: ['Monospace Font', 'Dark Header', 'Code Symbols', 'Bordered Chips'],
  },
};

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Resume Templates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from 6 professionally designed, ATS-friendly templates. Each template is optimized
            to pass Applicant Tracking Systems while looking great to human recruiters.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TEMPLATES.map((template) => {
            const preview = templatePreviews[template.id as keyof typeof templatePreviews];
            if (!preview) return null;
            const isSelected = selectedTemplate === template.id;

            return (
              <Card
                key={template.id}
                className={cn(
                  'relative overflow-hidden cursor-pointer transition-all hover:shadow-lg',
                  isSelected && 'ring-2 ring-primary shadow-lg'
                )}
                onClick={() => setSelectedTemplate(template.id)}
              >
                {/* Template Preview Visual */}
                <div className={cn(
                  'h-40 bg-gradient-to-br relative overflow-hidden',
                  preview.color
                )}>
                  {/* Mini resume preview */}
                  <div className="absolute inset-4 bg-white/95 rounded p-3 flex flex-col gap-1.5">
                    <div className="h-2 w-16 bg-gray-800 rounded-sm" />
                    <div className="h-1 w-24 bg-gray-300 rounded-sm" />
                    <div className="flex gap-1 mt-2">
                      <div className="h-1 w-8 bg-gray-200 rounded-sm" />
                      <div className="h-1 w-8 bg-gray-200 rounded-sm" />
                      <div className="h-1 w-8 bg-gray-200 rounded-sm" />
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-sm mt-1" />
                    <div className="h-1 w-full bg-gray-200 rounded-sm" />
                    <div className="h-1 w-3/4 bg-gray-200 rounded-sm" />
                    <div className="mt-2">
                      <div className="h-1.5 w-12 bg-gray-800 rounded-sm mb-1" />
                      <div className="h-1 w-full bg-gray-200 rounded-sm" />
                      <div className="h-1 w-full bg-gray-200 rounded-sm" />
                      <div className="h-1 w-5/6 bg-gray-200 rounded-sm" />
                    </div>
                    <div className="mt-1 flex gap-1">
                      <div className="h-3 px-2 bg-gray-100 rounded-full" />
                      <div className="h-3 px-2 bg-gray-100 rounded-full" />
                      <div className="h-3 px-2 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                  {template.isPremium && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      Pro
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{preview.name}</CardTitle>
                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{preview.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {preview.sections.map((section) => (
                      <span
                        key={section}
                        className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedTemplate && (
          <div className="mt-8 text-center">
            <Link href={`/resumes/new?template=${selectedTemplate}`}>
              <Button size="lg" className="px-8">
                Use This Template
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            All templates are ATS-friendly, print-ready, and fully customizable.
          </p>
          <p className="text-sm text-muted-foreground">
            Pro templates require an active subscription.
          </p>
        </div>
      </div>
    </div>
  );
}
