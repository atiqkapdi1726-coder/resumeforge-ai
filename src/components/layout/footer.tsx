import Link from 'next/link';
import { FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <FileText className="h-3 w-3 text-white" />
              </div>
              <span className="font-bold">ResumeForge AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Build a resume that gets noticed. AI-powered, ATS-optimized.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/ats" className="hover:text-foreground transition-colors">ATS Checker</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Get Started</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ResumeForge AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
