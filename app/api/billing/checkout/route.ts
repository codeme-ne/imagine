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

  const { pack, promoCode }: { pack?: Pack; promoCode?: string } = await req
    .json()
    .catch(() => ({} as { pack?: Pack; promoCode?: string }));
  const chosen: Pack = (pack && ["starter", "creator", "pro"].includes(pack)) ? (pack as Pack) : "starter";
  const cfg = packConfig[chosen];
  if (!cfg.priceId) {
    return NextResponse.json({ error: `Missing Stripe price for pack: ${chosen}` }, { status: 500 });
  }

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Optionally pre-apply a promotion code (e.g., 100% off) if provided
  // Fallback to letting users enter codes on the Checkout page.
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined = undefined;
  if (promoCode && typeof promoCode === "string" && promoCode.trim().length > 0) {
    try {
      const matches = await stripe.promotionCodes.list({ code: promoCode.trim(), active: true, limit: 1 });
      const found = matches.data[0];
      if (found?.id) {
        discounts = [{ promotion_code: found.id }];
      }
    } catch {
      // Ignore promo lookup failures and proceed without a pre-applied discount
    }
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    allow_promotion_codes: true,
    line_items: [
      {
        price: cfg.priceId,
        quantity: 1,
      },
    ],
    discounts,
    success_url: `${origin}/?purchase=success`,
    cancel_url: `${origin}/?purchase=cancelled`,
    client_reference_id: userId,
    customer_email: user.email || undefined,
    metadata: {
      credits: String(cfg.defaultCredits),
      pack: chosen,
      app: "imagine",
      promoCodeAttempt: promoCode ? String(promoCode) : "",
    },
  });

  return NextResponse.json({ url: checkout.url });
}
