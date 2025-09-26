'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, CreditCard, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  credits: number;
  pricePerCredit: number;
  description: string;
  features: string[];
  popular: boolean;
}

interface PricingClientProps {
  tiers: PricingTier[];
}

const VAT_RATE = 0.19; // German VAT rate 19%

export default function PricingClient({ tiers }: PricingClientProps) {
  const [showVAT, setShowVAT] = useState(true);
  const [vatId, setVatId] = useState('');
  const [isValidVatId, setIsValidVatId] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoCheckoutTriggeredRef = useRef(false);
  const { data: session } = useSession();

  // Note: These are display-only calculations
  // Actual pricing is handled by Stripe with fixed prices
  
  // Calculate display price based on VAT settings
  const calculatePrice = (basePrice: number) => {
    const price = basePrice;
    
    // Apply VAT if needed (B2C or no valid VAT ID)
    // Note: Stripe prices already include VAT for consumers
    // This is for display purposes only
    if (showVAT && !isValidVatId) {
      // Price already includes VAT, no change needed
      return price;
    } else if (!showVAT || isValidVatId) {
      // Show price without VAT (divide by 1.19)
      return price / (1 + VAT_RATE);
    }
    
    return price;
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Validate VAT ID format (simplified - in production would call validation API)
  const validateVatId = (id: string) => {
    // German VAT ID format: DE + 9 digits
    const germanVatRegex = /^DE\d{9}$/;
    // EU VAT ID format: 2 letters + variable digits
    const euVatRegex = /^[A-Z]{2}[\dA-Z]+$/;
    
    return germanVatRegex.test(id) || euVatRegex.test(id);
  };

  useEffect(() => {
    if (vatId) {
      setIsValidVatId(validateVatId(vatId));
    } else {
      setIsValidVatId(false);
    }
  }, [vatId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('promo') || params.get('promotion') || params.get('promotionCode');
    if (fromQuery) {
      setPromoCode(fromQuery.toUpperCase());
    }
  }, []);

  const promoAliases = new Set(['STARTER7', 'STARTER23', 'DANKE23']);

  const handleCheckout = useCallback(
    async (tierId: string, overridePromoCode?: string, options?: { skipAuthRedirect?: boolean }) => {
      const activePromoCode = (overridePromoCode || promoCode || undefined)?.trim()?.toUpperCase();

      // If not logged in, redirect to sign-in with callback
      if (!session && !options?.skipAuthRedirect) {
        const callbackParams = new URLSearchParams({ checkout: tierId });
        if (activePromoCode) {
          callbackParams.set('promo', activePromoCode);
        }

        const callbackUrl = `/pricing?${callbackParams.toString()}`;

        const signInParams = new URLSearchParams();
        signInParams.set('callbackUrl', callbackUrl);
        signInParams.set('plan', tierId);
        if (activePromoCode) {
          signInParams.set('promo', activePromoCode);
        }

        router.push(`/auth/signin?${signInParams.toString()}`);
        return;
      }

      try {
        const payload: { pack: string; promotionCode?: string } = { pack: tierId };
        if (activePromoCode) {
          payload.promotionCode = activePromoCode;
        }

        const res = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error('Checkout error:', error);
      }
    },
    [promoCode, router, session]
  );

  // Auto-resume checkout after successful login when callback params are present
  useEffect(() => {
    if (!session) {
      autoCheckoutTriggeredRef.current = false;
      return;
    }

    if (!searchParams) {
      return;
    }

    const checkoutPlan = searchParams.get('checkout');
    if (!checkoutPlan || autoCheckoutTriggeredRef.current) {
      return;
    }

    autoCheckoutTriggeredRef.current = true;
    const promoFromQuery = searchParams.get('promo') || undefined;

    // Remove the query params to avoid repeated triggers
    router.replace('/pricing');

    void handleCheckout(checkoutPlan, promoFromQuery ?? undefined, { skipAuthRedirect: true });
  }, [handleCheckout, router, searchParams, session]);

  return (
    <div className="space-y-8">
      {promoCode && (
        <div className="max-w-2xl mx-auto rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-900">
          <p className="font-medium">Promotion {promoCode} aktiviert</p>
          {promoAliases.has(promoCode) ? (
            <p className="text-sm mt-1">
              Die erste Starter-Bestellung ist kostenlos. Nach Abschluss werden automatisch 7 Credits gutgeschrieben.
            </p>
          ) : (
            <p className="text-sm mt-1">
              Der Gutscheincode wird automatisch auf deine nächste Zahlung angewendet.
            </p>
          )}
        </div>
      )}

      {/* VAT and Billing Options */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Billing Options</CardTitle>
          <CardDescription>Customize your purchase for best value</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* VAT Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="vat-toggle" className="text-base">
                Show prices with VAT
              </Label>
              <p className="text-sm text-muted-foreground">
                {showVAT ? 'Showing prices inkl. 19% MwSt.' : 'Showing prices excl. VAT'}
              </p>
            </div>
            <Switch
              id="vat-toggle"
              checked={showVAT}
              onCheckedChange={setShowVAT}
              aria-label="Toggle VAT display"
            />
          </div>

          {/* VAT ID Input (for B2B) */}
          {showVAT && (
            <div className="space-y-2">
              <Label htmlFor="vat-id">EU VAT ID (for businesses)</Label>
              <div className="flex gap-2">
                <Input
                  id="vat-id"
                  placeholder="e.g., DE123456789"
                  value={vatId}
                  onChange={(e) => setVatId(e.target.value.toUpperCase())}
                  className={cn(
                    "flex-1",
                    isValidVatId && "border-green-500"
                  )}
                />
                {isValidVatId && (
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    <span className="text-sm">Valid</span>
                  </div>
                )}
              </div>
              {isValidVatId && (
                <p className="text-sm text-green-600">
                  Reverse charge applies - 0% VAT for EU businesses
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const finalPrice = calculatePrice(tier.price);
          const pricePerCredit = finalPrice / tier.credits;
          const promoApplies = tier.id === 'starter' && !!promoCode && promoAliases.has(promoCode);

          return (
            <Card
              key={tier.id}
              className={cn(
                "relative flex flex-col",
                tier.popular && "border-primary shadow-lg"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                    Beliebteste Wahl
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      {formatPrice(finalPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {showVAT && !isValidVatId ? 'inkl. 19% MwSt.' : 'zzgl. MwSt.'}
                  </p>
                  <p className="text-sm font-medium mt-2">
                    {tier.credits} credits • {formatPrice(pricePerCredit)}/credit
                  </p>
                  {promoApplies && (
                    <p className="text-sm text-green-600 mt-2">
                      Promo {promoCode}: Bezahle 0 € und erhalte 7 Credits auf dein Konto.
                    </p>
                  )}
                </div>

                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleCheckout(tier.id)}
                  className="w-full"
                  size="lg"
                  variant={tier.popular ? "default" : "outline"}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {session ? 'Buy Credits' : 'Sign In to Buy'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Additional Information */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-1">For Businesses (B2B)</h4>
            <p className="text-muted-foreground">
              Enter your valid EU VAT ID to apply reverse charge mechanism (0% VAT).
              Invoice will show &bdquo;Steuerschuldnerschaft des Leistungsempfängers&ldquo; as required.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Electronic Invoices</h4>
            <p className="text-muted-foreground">
              All invoices are provided electronically via email in compliance with German e-invoicing requirements.
              PDF invoices are available for download after purchase.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Credits Never Expire</h4>
            <p className="text-muted-foreground">
              Once purchased, your credits remain in your account indefinitely. 
              Use them at your own pace with no pressure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}