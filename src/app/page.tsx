import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, FileText, Zap, Shield, ArrowRight, Star } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'ATS-Friendly Templates',
    description: '6 professionally designed templates that pass Applicant Tracking Systems.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Improvements',
    description: 'Get intelligent suggestions to enhance your resume content.',
  },
  {
    icon: Shield,
    title: 'ATS Score Analysis',
    description: 'Real-time scoring against job descriptions with actionable insights.',
  },
  {
    icon: CheckCircle,
    title: 'Job Matching',
    description: 'Analyze how well your resume matches specific job requirements.',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    content: 'ResumeForge AI helped me tailor my resume for each application. Got 3 interview calls in a week!',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Product Manager',
    content: 'The ATS analysis was a game-changer. I finally understood why my resume was being rejected.',
    rating: 5,
  },
  {
    name: 'Anita Patel',
    role: 'Data Scientist',
    content: 'The AI suggestions improved my resume quality significantly. Highly recommended!',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build a resume that{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                gets noticed
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Create an ATS-friendly resume, tailor it to every job, and improve your application with
              AI-powered recommendations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="text-base">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Start building your resume today.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to land your dream job
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features to help you create, optimize, and track your resume.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 bg-muted/50">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to create your perfect resume.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Create Your Resume',
                description: 'Choose a template and fill in your details with our intuitive builder.',
              },
              {
                step: '02',
                title: 'Analyze & Optimize',
                description: 'Get your ATS score and receive AI-powered suggestions for improvement.',
              },
              {
                step: '03',
                title: 'Apply & Track',
                description: 'Download your resume and track your application progress.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by job seekers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our users have to say about ResumeForge AI.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-0 bg-muted/50">
                <CardContent className="p-6">
                  <div className="flex mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build your resume?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Join thousands of job seekers who have landed their dream jobs with ResumeForge AI.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-base">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
