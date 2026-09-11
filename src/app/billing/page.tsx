'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';
import { Check, CreditCard } from 'lucide-react';

export default function BillingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan: string) => {
    setLoading(true);
    try {
      // In production, this would initiate Razorpay checkout
      console.log('Upgrading to plan:', plan);
    } catch (error) {
      console.error('Failed to upgrade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Billing</h1>

        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold capitalize">
                    {user?.subscription.plan || 'Free'} Plan
                  </p>
                  <p className="text-muted-foreground">
                    {user?.subscription.plan === 'free'
                      ? '₹0/month'
                      : user?.subscription.plan === 'pro'
                      ? '₹199/month'
                      : '₹999/year'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-green-600">
                    {user?.subscription.status || 'Active'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Resumes</p>
                  <p className="text-2xl font-bold">
                    {user?.usage.resumesCreated || 0}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{user?.subscription.plan === 'free' ? '1' : '∞'}
                    </span>
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">ATS Checks</p>
                  <p className="text-2xl font-bold">
                    {user?.usage.atsChecks || 0}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{user?.subscription.plan === 'free' ? '3' : '∞'}
                    </span>
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">AI Improvements</p>
                  <p className="text-2xl font-bold">
                    {user?.usage.aiImprovements || 0}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{user?.subscription.plan === 'free' ? '5' : '∞'}
                    </span>
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">PDF Downloads</p>
                  <p className="text-2xl font-bold">
                    {user?.usage.pdfDownloads || 0}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{user?.subscription.plan === 'free' ? '3' : '∞'}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Options */}
          {user?.subscription.plan === 'free' && (
            <Card>
              <CardHeader>
                <CardTitle>Upgrade Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 border rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Pro</h3>
                    <p className="text-2xl font-bold mb-4">
                      ₹199<span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                    <ul className="space-y-2 mb-6">
                      {[
                        'Unlimited resumes',
                        'All templates',
                        'Advanced ATS analysis',
                        'AI resume rewriting',
                        'Cover letters',
                      ].map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade('pro')}
                      disabled={loading}
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                  <div className="p-6 border rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Annual</h3>
                    <p className="text-2xl font-bold mb-4">
                      ₹999<span className="text-sm font-normal text-muted-foreground">/year</span>
                    </p>
                    <ul className="space-y-2 mb-6">
                      {[
                        'Everything in Pro',
                        'Save ₹1,389/year',
                        'Early access to features',
                        'Priority support',
                      ].map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleUpgrade('annual')}
                      disabled={loading}
                    >
                      Upgrade to Annual
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-4">
                No payment history yet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
