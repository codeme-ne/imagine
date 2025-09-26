import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

type Pack = "starter" | "creator" | "pro";

const packConfig: Record<Pack, { priceId?: string; defaultCredits: number }> = {
  starter: { priceId: process.env.STRIPE_PRICE_STARTER, defaultCredits: Number(process.env.CREDITS_STARTER ?? 20) },
  creator: { priceId: process.env.STRIPE_PRICE_CREATOR, defaultCredits: Number(process.env.CREDITS_CREATOR ?? 60) },
  pro: { priceId: process.env.STRIPE_PRICE_PRO, defaultCredits: Number(process.env.CREDITS_PRO ?? 200) },
};

type PromoConfig = {
  envKey: string;
  credits: number;
  allowedPacks?: Pack[];
};

const promoConfig: Record<string, PromoConfig> = {
  STARTER7: {
    envKey: "STRIPE_COUPON_STARTER7",
    credits: 7,
    allowedPacks: ["starter"],
  },
  STARTER23: {
    envKey: "STRIPE_COUPON_STARTER7",
    credits: 7,
    allowedPacks: ["starter"],
  },
  DANKE23: {
    envKey: "STRIPE_COUPON_STARTER7",
    credits: 7,
    allowedPacks: ["starter"],
  },
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = session.user as { id?: string; email?: string };
  const userId = user.id || user.email || "";
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const { pack, promotionCode }: { pack?: Pack; promotionCode?: string } = await req
    .json()
    .catch(() => ({} as { pack?: Pack; promotionCode?: string }));
  const chosen: Pack = (pack && ["starter", "creator", "pro"].includes(pack)) ? (pack as Pack) : "starter";
  const cfg = packConfig[chosen];
  if (!cfg.priceId) {
    return NextResponse.json({ error: `Missing Stripe price for pack: ${chosen}` }, { status: 500 });
  }

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const promoKey = promotionCode?.trim().toUpperCase();
  const promo = promoKey ? promoConfig[promoKey] : undefined;
  const couponId = promo?.envKey ? process.env[promo.envKey] : undefined;

  if (promo && promo.allowedPacks && !promo.allowedPacks.includes(chosen)) {
    return NextResponse.json({ error: "Promotion code not valid for selected pack" }, { status: 400 });
  }

  if (promo && !couponId) {
    console.warn(`Promotion code ${promoKey} configured but missing env ${promo.envKey}`);
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    allow_promotion_codes: !couponId,
    discounts: couponId ? [{ coupon: couponId }] : undefined,
    line_items: [
      {
        price: cfg.priceId,
        quantity: 1,
      },
    ],
    success_url: `${origin}/?purchase=success`,
    cancel_url: `${origin}/?purchase=cancelled`,
    client_reference_id: userId,
    customer_email: user.email || undefined,
    metadata: {
      credits: String(promo?.credits ?? cfg.defaultCredits),
      pack: chosen,
      app: "imagine",
      ...(promoKey ? { promotionCode: promoKey } : {}),
    },
  });

  return NextResponse.json({ url: checkout.url });
}
