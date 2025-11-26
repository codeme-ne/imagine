import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { awardCredits } from "@/lib/credits";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

const redis = Redis.fromEnv();
const kSeen = (id: string) => `stripe:seen_event:${id}`;
const kDeadLetter = (id: string) => `stripe:dlq:${id}`;

/**
 * Log failed credit award attempts to Redis for manual review.
 * Events are stored for 30 days before expiring.
 */
async function logToDeadLetter(eventId: string, payload: object, error: Error): Promise<void> {
  try {
    await redis.set(
      kDeadLetter(eventId),
      JSON.stringify({
        ...payload,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      { ex: 60 * 60 * 24 * 30 } // 30 days
    );
  } catch (dlqError) {
    // If DLQ logging fails, log to console but don't block the webhook retry
    console.error("Failed to log to dead-letter queue:", dlqError);
  }
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const body = await req.text();
  let evt: Stripe.Event;
  try {
    evt = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new NextResponse(`Webhook signature verification failed. ${(err as Error).message}`, { status: 400 });
  }

  // Idempotency guard
  const seen = await redis.set(kSeen(evt.id), "1", { nx: true, ex: 60 * 60 * 24 * 7 }); // 7 days
  if (seen !== "OK") {
    return NextResponse.json({ received: true, idempotent: true });
  }

  switch (evt.type) {
    case "checkout.session.completed": {
      const session = evt.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const creditsStr = session.metadata?.credits;
      const credits = creditsStr ? parseInt(creditsStr, 10) : 0;
      if (userId && credits > 0) {
        try {
          await awardCredits(userId, credits);
        } catch (e) {
          // Log to dead-letter queue for manual review
          await logToDeadLetter(evt.id, {
            eventType: evt.type,
            userId,
            credits,
            sessionId: session.id,
          }, e as Error);
          // Re-throw to trigger Stripe retry
          throw e;
        }
      }
      break;
    }
    default:
      // ignore other events for now
      break;
  }

  return NextResponse.json({ received: true });
}

