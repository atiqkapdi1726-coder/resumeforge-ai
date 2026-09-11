'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Target, Lock, Rocket } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: 'AI-Powered Precision',
      description:
        'We leverage cutting-edge language models to craft resumes that speak the language of both recruiters and algorithms.',
    },
    {
      icon: Target,
      title: 'Tailored to You',
      description:
        'Every resume is uniquely generated based on your experience, skills, and the specific role you are targeting.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description:
        'Your data is encrypted end-to-end. We never sell your information or share it with third parties.',
    },
    {
      icon: Rocket,
      title: 'Built for Results',
      description:
        'Our templates and content strategies are refined using real-world ATS data and hiring trends.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          About ResumeForge AI
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          We believe everyone deserves a resume that opens doors. ResumeForge AI combines
          artificial intelligence with expert resume strategy to help job seekers stand out in
          competitive markets — not just pass through automated filters.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v) => (
            <Card key={v.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <v.icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {v.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {v.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Technology
        </h2>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">GPT-4</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Content generation and optimization
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Next.js</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Full-stack React framework
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Firebase</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Authentication and cloud infrastructure
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-24 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Ready to build your resume?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Start creating ATS-optimized resumes in minutes.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="px-8">
            Get Started Free
          </Button>
        </Link>
      </section>
    </div>
  );
}
