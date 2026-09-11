import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { PRICING_PLANS } from '@/config';
import { formatCurrency } from '@/lib/utils';

type Plan = (typeof PRICING_PLANS)[number] & { isPopular?: boolean };

export default function PricingPage() {
  return (
    <div className="container py-20 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that works for you. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {PRICING_PLANS.map((plan) => {
          const p = plan as Plan;
          return (
            <Card
              key={p.id}
              className={`relative ${
                p.isPopular
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-muted'
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatCurrency(p.price)}</span>
                  <span className="text-muted-foreground">
                    /{p.interval === 'year' ? 'year' : 'month'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {p.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/register">
                    <Button
                      className="w-full"
                      variant={p.isPopular ? 'default' : 'outline'}
                    >
                      {p.id === 'free' ? 'Get Started' : 'Upgrade to Pro'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <p className="text-muted-foreground">
          All plans include a 7-day free trial. No credit card required.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              question: 'Can I cancel my subscription anytime?',
              answer: 'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.',
            },
            {
              question: 'Is there a free trial?',
              answer: 'Yes, all paid plans come with a 7-day free trial. No credit card required to start.',
            },
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit cards, debit cards, UPI, and net banking through Razorpay.',
            },
            {
              question: 'Can I switch between plans?',
              answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.',
            },
          ].map((faq) => (
            <div key={faq.question} className="border rounded-lg p-6">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
