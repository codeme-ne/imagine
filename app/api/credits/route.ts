import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ensureTrial, getCredits, getDailyRemaining } from "@/lib/credits";

export const runtime = "edge";

const DAILY_CAP = 100; // images/day

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = session.user as { id?: string; email?: string };
  const userId = user.id || user.email || "";
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Grant free trial on first login/access (1 credit)
  await ensureTrial(userId, 1);

  const [balance, dailyRemaining] = await Promise.all([
    getCredits(userId),
    getDailyRemaining(userId, DAILY_CAP),
  ]);

  return NextResponse.json({ credits: balance, dailyRemaining, dailyCap: DAILY_CAP });
}
