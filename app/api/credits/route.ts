import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ensureTrial, getCredits, getDailyRemaining } from "@/lib/credits";

export const runtime = "edge";

const DAILY_CAP = 100; // images/day

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Grant free trial on first login/access
  await ensureTrial(userId, 2);

  const [balance, dailyRemaining] = await Promise.all([
    getCredits(userId),
    getDailyRemaining(userId, DAILY_CAP),
  ]);

  return NextResponse.json({ credits: balance, dailyRemaining, dailyCap: DAILY_CAP });
}

