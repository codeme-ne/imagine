import { Suspense } from 'react';
import type { Metadata } from 'next';
import PricingClient from './pricing-client';

export const metadata: Metadata = {
  title: 'Pricing - PageTopic | AI Image Generation Credits',
  description: 'Transparent pay-as-you-go pricing for AI-powered image generation. No subscriptions, just credits. DACH-compliant with VAT options.',
};

// Pricing tiers configuration matching existing Stripe setup
const pricingTiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: 5,
    credits: 20,
    pricePerCredit: 0.25,
    description: 'Perfect for trying out our service',
    features: [
      '20 AI-generated images',
      'All 6 image styles',
      'High-resolution downloads',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 12,
    credits: 60,
    pricePerCredit: 0.20,
    description: 'For regular content creators',
    features: [
      '60 AI-generated images',
      'All 11 image styles',
      'High-resolution downloads',
      'Priority email support',
      '20% savings per credit',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 35,
    credits: 200,
    pricePerCredit: 0.175,
    description: 'Best value for teams and agencies',
    features: [
      '200 AI-generated images',
      'All 11 image styles',
      'High-resolution downloads',
      'Priority support',
      '30% savings per credit',
      'Volume discount applied',
    ],
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Pay only for what you use. No subscriptions, no hidden fees.
          1 credit = 1 AI-generated image. Credits never expire.
        </p>
      </div>
      
      <Suspense
        fallback={
          <div className="flex justify-center py-24">
            <div className="space-y-4 text-center">
              <div className="h-6 w-48 mx-auto rounded-full bg-muted/60 animate-pulse" />
              <p className="text-muted-foreground">Loading pricing…</p>
            </div>
          </div>
        }
      >
        <PricingClient tiers={pricingTiers} />
      </Suspense>
    </div>
  );
}