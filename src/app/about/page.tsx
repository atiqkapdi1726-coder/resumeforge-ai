import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Zap, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About ResumeForge AI</h1>
        
        <div className="prose prose-lg mx-auto">
          <p className="text-xl text-muted-foreground text-center mb-12">
            We&apos;re on a mission to help everyone build a resume that gets noticed.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower job seekers with AI-powered tools that help them create
                  compelling, ATS-friendly resumes that open doors to new opportunities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Who We Serve</h3>
                <p className="text-muted-foreground">
                  Job seekers at all career levels, from fresh graduates to experienced
                  professionals looking to advance their careers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Zap className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">What We Offer</h3>
                <p className="text-muted-foreground">
                  A complete resume building platform with ATS analysis, AI-powered
                  improvements, and job matching capabilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Our Values</h3>
                <p className="text-muted-foreground">
                  Privacy-first, transparent, and results-driven. We believe in
                  empowering users, not manipulating them.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to build your resume?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of job seekers who have landed their dream jobs with ResumeForge AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
