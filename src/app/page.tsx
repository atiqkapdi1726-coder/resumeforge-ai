import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle,
  FileText,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Bot,
  Target,
  Layout,
  Download,
  ChevronRight,
} from 'lucide-react';
import { PRICING_PLANS } from '@/config';
import { formatCurrency } from '@/lib/utils';

const templates = [
  { name: 'Classic ATS', color: 'bg-blue-500', accent: 'bg-blue-100' },
  { name: 'Modern Professional', color: 'bg-emerald-500', accent: 'bg-emerald-100' },
  { name: 'Executive', color: 'bg-slate-700', accent: 'bg-slate-200' },
  { name: 'Minimal', color: 'bg-neutral-500', accent: 'bg-neutral-100' },
  { name: 'Graduate', color: 'bg-violet-500', accent: 'bg-violet-100' },
  { name: 'Technical', color: 'bg-orange-500', accent: 'bg-orange-100' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Infosys',
    text: 'ResumeForge AI transformed my resume completely. The ATS score helped me understand why I was getting rejected. Landed my dream job within 2 weeks!',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Product Manager at Flipkart',
    text: 'The AI tailoring feature is a game-changer. I customized my resume for 10 different job postings in under an hour. Highly recommend the Pro plan.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'Fresh Graduate, IIT Delhi',
    text: 'As a fresher, I had no idea how to write a professional resume. The Graduate template and AI suggestions made my resume look like I had years of experience.',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'How does the AI resume builder work?',
    a: 'Simply fill in your details, and our AI analyzes your information to create a professionally formatted, ATS-optimized resume. You can then customize it further or tailor it for specific jobs.',
  },
  {
    q: 'What is an ATS score and why does it matter?',
    a: 'ATS (Applicant Tracking System) software scans resumes before a human sees them. Our ATS score analyzes your resume against these systems and suggests improvements to ensure you pass the initial screening.',
  },
  {
    q: 'Can I create multiple resumes?',
    a: 'Free users can create 1 resume. Pro and Annual plan users can create unlimited resumes, each tailored for different job applications.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use Firebase Authentication and encrypted storage. Your personal data is never shared with third parties and you can delete your account and data at any time.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, you can cancel your subscription at any time from the Billing page. You will continue to have access to premium features until the end of your billing period.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_50%_50%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
              <Zap className="h-4 w-4 text-primary" />
              AI-Powered Resume Builder
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build a resume that{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                gets noticed.
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Create an ATS-friendly resume in minutes with AI. Get scored against real ATS systems,
              tailor your resume for every job, and land more interviews.
            </p>
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2 text-base">
                  Create My Resume
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg" className="text-base">
                  View Templates
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                ATS-Optimized
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                AI-Powered
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Free to Start
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mb-16 text-lg text-muted-foreground">
            Three simple steps to your perfect resume
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-b from-background to-muted/30 shadow-md">
            <CardContent className="p-8 text-center">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-7 w-7" />
              </div>
              <div className="mb-2 text-sm font-semibold text-primary">Step 1</div>
              <h3 className="mb-2 text-xl font-semibold">Tell Us About Yourself</h3>
              <p className="text-muted-foreground">
                Fill in your experience, education, skills, and career goals with our guided editor.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-0 bg-gradient-to-b from-background to-muted/30 shadow-md">
            <CardContent className="p-8 text-center">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-7 w-7" />
              </div>
              <div className="mb-2 text-sm font-semibold text-primary">Step 2</div>
              <h3 className="mb-2 text-xl font-semibold">AI Builds Your Resume</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your information and creates a polished, professional resume tailored to your goals.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-0 bg-gradient-to-b from-background to-muted/30 shadow-md">
            <CardContent className="p-8 text-center">
              <div className="mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Target className="h-7 w-7" />
              </div>
              <div className="mb-2 text-sm font-semibold text-primary">Step 3</div>
              <h3 className="mb-2 text-xl font-semibold">Apply & Get Hired</h3>
              <p className="text-muted-foreground">
                Download your ATS-optimized resume as a PDF and apply with confidence to your dream job.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need</h2>
            <p className="mb-16 text-lg text-muted-foreground">
              Powerful features to create a winning resume
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 bg-background shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">AI Resume Builder</h3>
                <p className="text-sm text-muted-foreground">
                  Let AI create your complete professional resume. Just provide your details and watch the magic happen.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-background shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">ATS Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Get scored against real ATS systems. Know exactly what recruiters see before they see it.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-background shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layout className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">Smart Templates</h3>
                <p className="text-sm text-muted-foreground">
                  6 ATS-friendly templates that pass screening. Each designed for maximum readability and impact.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-background shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">Job Tailoring</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your resume for every application. AI rewrites content to match job descriptions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-background shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">AI Cover Letters</h3>
                <p className="text-sm text-muted-foreground">
                  Generate personalized cover letters that complement your resume and highlight your strengths.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-background shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">Real-time Preview</h3>
                <p className="text-sm text-muted-foreground">
                  See changes instantly as you edit. No guessing, just your resume updating in real time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Choose your template</h2>
          <p className="mb-16 text-lg text-muted-foreground">
            ATS-friendly designs that make a lasting impression
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.name} className="group cursor-pointer overflow-hidden border-0 shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
              <div className={`h-48 ${t.accent} p-6 flex flex-col justify-between`}>
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded ${t.color}`} />
                  <div className="h-2.5 w-24 rounded bg-foreground/10" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded bg-foreground/10" />
                  <div className="h-2 w-3/4 rounded bg-foreground/10" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded bg-foreground/5" />
                  <div className="h-1.5 w-5/6 rounded bg-foreground/5" />
                  <div className="h-1.5 w-2/3 rounded bg-foreground/5" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{t.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/templates">
            <Button variant="outline" size="lg" className="gap-2">
              See All Templates
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Beat the ATS. Get interviews.
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Over 75% of resumes are rejected by ATS before a human ever sees them. Our ATS
                optimization engine analyzes your resume against these systems and gives you an
                actionable score with specific improvements.
              </p>
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Get Your ATS Score
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="mb-6 text-lg font-semibold">Sample ATS Breakdown</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Keyword Match', score: 84, color: 'bg-primary' },
                    { label: 'Skills Match', score: 90, color: 'bg-emerald-500' },
                    { label: 'Format Score', score: 95, color: 'bg-blue-500' },
                    { label: 'Experience Depth', score: 78, color: 'bg-violet-500' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground">{item.score}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg bg-muted/50 p-4 text-center">
                  <span className="text-sm text-muted-foreground">Overall ATS Score</span>
                  <div className="text-3xl font-bold text-primary">87/100</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mb-16 text-lg text-muted-foreground">
            Start free, upgrade when you need more
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {PRICING_PLANS.map((p) => {
            const plan = p as typeof p & { isPopular?: boolean };
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden ${
                  plan.isPopular
                    ? 'border-primary shadow-xl ring-1 ring-primary/20'
                    : 'shadow-md'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="my-4">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">
                        /{plan.interval === 'year' ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button
                      variant={plan.isPopular ? 'default' : 'outline'}
                      className="w-full"
                      size="lg"
                    >
                      {plan.price === 0 ? 'Get Started Free' : `Upgrade to ${plan.name}`}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by job seekers
            </h2>
            <p className="mb-16 text-lg text-muted-foreground">
              See what our users have to say
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 bg-background shadow-md">
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-16 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group rounded-lg border bg-background p-6">
              <summary className="cursor-pointer list-none text-base font-semibold">
                {faq.q}
              </summary>
              <p className="mt-3 text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build your resume?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of job seekers who landed their dream roles with ResumeForge AI.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2 text-base">
              Create My Resume
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">ResumeForge AI</span>
            </div>
            <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <Link href="/templates" className="hover:text-foreground transition-colors">
                Templates
              </Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="hover:text-foreground transition-colors">
                Log In
              </Link>
              <Link href="/register" className="hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ResumeForge AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
