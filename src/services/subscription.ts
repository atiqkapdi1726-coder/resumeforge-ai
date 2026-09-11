'use client';

import { PRICING_PLANS } from '@/config';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    maxResumes: number;
    maxAtsChecks: number;
    maxAiImprovements: number;
    maxPdfDownloads: number;
    premiumTemplates: boolean;
    advancedAnalysis: boolean;
    coverLetters: boolean;
    jobMatching: boolean;
  };
  isPopular?: boolean;
}

export function getPlans(): PricingPlan[] {
  return PRICING_PLANS as unknown as PricingPlan[];
}

export function getPlanById(id: string): PricingPlan | undefined {
  return (PRICING_PLANS as unknown as PricingPlan[]).find((p) => p.id === id);
}

export function canPerformAction(
  plan: string,
  resource: string,
  currentUsage: number
): { allowed: boolean; remaining: number; limit: number } {
  const planConfig = getPlanById(plan);
  if (!planConfig) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const limits = planConfig.limits as Record<string, number | boolean>;
  const limit = limits[resource];

  if (typeof limit === 'boolean') {
    return { allowed: limit, remaining: limit ? Infinity : 0, limit: limit ? Infinity : 0 };
  }

  if (limit === -1) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const remaining = Math.max(0, (limit as number) - currentUsage);
  return {
    allowed: currentUsage < (limit as number),
    remaining,
    limit: limit as number,
  };
}
