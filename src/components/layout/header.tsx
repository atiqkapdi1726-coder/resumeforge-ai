'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X, LogOut, Settings, CreditCard, FileText, ChevronDown } from 'lucide-react';

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ResumeForge AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 ml-auto">
          <Link href="/templates" className="text-sm font-medium hover:text-primary transition-colors">
            Templates
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/ats" className="text-sm font-medium hover:text-primary transition-colors">
            ATS Checker
          </Link>

          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 hover:bg-accent rounded-lg px-2 py-1 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full" />
                    ) : (
                      getInitials(user.displayName || 'U')
                    )}
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-lg shadow-lg z-50 py-1">
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent" onClick={() => setUserMenuOpen(false)}>
                        <FileText className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent" onClick={() => setUserMenuOpen(false)}>
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <Link href="/billing" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent" onClick={() => setUserMenuOpen(false)}>
                        <CreditCard className="h-4 w-4" /> Billing
                      </Link>
                      <div className="border-t" />
                      <button
                        className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent w-full"
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started Free</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden ml-auto p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-3">
          <Link href="/templates" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Templates</Link>
          <Link href="/pricing" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link href="/ats" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>ATS Checker</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link href="/settings" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Settings</Link>
              <Link href="/billing" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Billing</Link>
              <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={() => { signOut(); setMobileMenuOpen(false); }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
