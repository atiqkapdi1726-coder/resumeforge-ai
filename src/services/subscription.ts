import { PricingPlan, PlanLimits } from '@/types';
import { PRICING_PLANS } from '@/config';

export function getPlans(): PricingPlan[] {
  return PRICING_PLANS as unknown as PricingPlan[];
}

export function getPlanById(id: string): PricingPlan | undefined {
  return (PRICING_PLANS as unknown as PricingPlan[]).find((p) => p.id === id);
}

export function checkUsageLimit(
  plan: string,
  resource: keyof PlanLimits,
  currentUsage: number
): boolean {
  const planConfig = getPlanById(plan);
  if (!planConfig) return false;

  const limit = planConfig.limits[resource];
  if (typeof limit === 'boolean') return limit;
  if (limit === -1) return true;
  return currentUsage < limit;
}

export function getUsageLimit(plan: string, resource: keyof PlanLimits): number {
  const planConfig = getPlanById(plan);
  if (!planConfig) return 0;

  const limit = planConfig.limits[resource];
  if (typeof limit === 'boolean') return limit ? Infinity : 0;
  return limit === -1 ? Infinity : limit;
}

export function canPerformAction(
  plan: string,
  resource: keyof PlanLimits,
  currentUsage: number
): { allowed: boolean; remaining: number; limit: number } {
  const planConfig = getPlanById(plan);
  if (!planConfig) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const limit = planConfig.limits[resource];

  if (typeof limit === 'boolean') {
    return { allowed: limit, remaining: limit ? Infinity : 0, limit: limit ? Infinity : 0 };
  }

  if (limit === -1) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const remaining = Math.max(0, limit - currentUsage);
  return {
    allowed: currentUsage < limit,
    remaining,
    limit,
  };
}
