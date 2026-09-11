'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, CreditCard, Zap, Crown, Loader2 } from 'lucide-react';
import { PRICING_PLANS } from '@/config';
import { formatCurrency } from '@/lib/utils';

interface UserData {
  plan: string;
  subscription: {
    status: string;
    currentPeriodEnd: string;
  } | null;
}

interface UsageData {
  resumes: { used: number; limit: number };
  atsChecks: { used: number; limit: number };
  aiImprovements: { used: number; limit: number };
  pdfDownloads: { used: number; limit: number };
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  plan: string;
  status: string;
}

export default function BillingPage() {
  const { user, getIdToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [razorpayConfigured, setRazorpayConfigured] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBillingData();
  }, [user, router]);

  const fetchBillingData = async () => {
    try {
      const token = await getIdToken();
      if (!token) return;

      const [userRes, usageRes, paymentsRes] = await Promise.all([
        fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/usage', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/payments/history', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (userRes.ok) {
        const data = await userRes.json();
        setUserData(data.user ?? data);
      }

      if (usageRes.ok) {
        const data = await usageRes.json();
        setUsage(data);
      } else {
        setUsage({
          resumes: { used: 0, limit: 1 },
          atsChecks: { used: 0, limit: 3 },
          aiImprovements: { used: 0, limit: 5 },
          pdfDownloads: { used: 0, limit: 3 },
        });
      }

      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.payments ?? []);
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
      setUsage({
        resumes: { used: 0, limit: 1 },
        atsChecks: { used: 0, limit: 3 },
        aiImprovements: { used: 0, limit: 5 },
        pdfDownloads: { used: 0, limit: 3 },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      setUpgrading(planId);
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === 'Razorpay not configured') {
          setRazorpayConfigured(false);
          return;
        }
        throw new Error(data.error || 'Failed to create order');
      }

      const order = await res.json();

      if (!order.key) {
        setRazorpayConfigured(false);
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'ResumeForge AI',
        description: `${planId === 'annual' ? 'Annual' : 'Pro'} Plan`,
        order_id: order.orderId,
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planId,
              }),
            });

            if (verifyRes.ok) {
              window.location.reload();
            }
          } catch {
            alert('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          email: user?.email ?? '',
          name: user?.displayName ?? '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const Razorpay = (window as unknown as Record<string, unknown>)['Razorpay'] as
        | { new (options: Record<string, unknown>): { open: () => void } }
        | undefined;
      if (Razorpay) {
        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        setRazorpayConfigured(false);
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setUpgrading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentPlanId = userData?.plan ?? 'free';
  const currentPlan = PRICING_PLANS.find((p) => p.id === currentPlanId) ?? PRICING_PLANS[0];
  const isFreePlan = currentPlanId === 'free';

  const formatLimit = (limit: number) => (limit === -1 ? 'Unlimited' : limit);

  const usageItems = usage
    ? [
        { label: 'Resumes', used: usage.resumes.used, limit: usage.resumes.limit },
        { label: 'ATS Checks', used: usage.atsChecks.used, limit: usage.atsChecks.limit },
        { label: 'AI Improvements', used: usage.aiImprovements.used, limit: usage.aiImprovements.limit },
        { label: 'PDF Downloads', used: usage.pdfDownloads.used, limit: usage.pdfDownloads.limit },
      ]
    : [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Billing & Subscription</h1>

      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-bold">{currentPlan.name}</div>
            <div className="mb-4 text-sm text-muted-foreground">
              {currentPlan.price === 0
                ? 'Free forever'
                : `${formatCurrency(currentPlan.price)}/${currentPlan.interval === 'year' ? 'year' : 'month'}`}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {userData?.subscription?.status ?? (isFreePlan ? 'Free' : 'Active')}
                </span>
              </div>
              {userData?.subscription?.currentPeriodEnd && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next billing date</span>
                  <span className="font-medium">
                    {new Date(userData.subscription.currentPeriodEnd).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Usage This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageItems.map((item) => {
                const pct =
                  item.limit === -1
                    ? 0
                    : Math.min(100, Math.round((item.used / item.limit) * 100));
                const atLimit = item.limit !== -1 && item.used >= item.limit;
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className={atLimit ? 'font-semibold text-destructive' : 'text-muted-foreground'}>
                        {item.used} / {formatLimit(item.limit)}
                      </span>
                    </div>
                    {item.limit !== -1 && (
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${
                            atLimit ? 'bg-destructive' : 'bg-primary'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                    {atLimit && (
                      <p className="mt-1 text-xs text-destructive">
                        Limit reached. Upgrade for unlimited access.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {isFreePlan && (
        <div className="mb-10">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Upgrade Your Plan</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {PRICING_PLANS.filter((p) => p.id !== 'free').map((p) => {
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
                      <span className="text-4xl font-bold">{formatCurrency(plan.price)}</span>
                      <span className="text-muted-foreground">
                        /{plan.interval === 'year' ? 'year' : 'month'}
                      </span>
                    </div>
                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      variant={plan.isPopular ? 'default' : 'outline'}
                      className="w-full"
                      size="lg"
                      disabled={upgrading !== null}
                    >
                      {upgrading === plan.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                      )}
                      Upgrade to {plan.name}
                    </Button>
                    {!razorpayConfigured && (
                      <p className="mt-3 text-center text-xs text-destructive">
                        Payment system is not configured. Please contact support.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <CreditCard className="mx-auto mb-3 h-10 w-10 opacity-50" />
              <p>No payments yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Plan</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-3">
                        {new Date(p.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 capitalize">{p.plan}</td>
                      <td className="py-3 font-medium">{formatCurrency(p.amount)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
