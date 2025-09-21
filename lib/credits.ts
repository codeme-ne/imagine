import { Redis } from "@upstash/redis";

// Centralized Redis instance from env
const redis = Redis.fromEnv();

// Key helpers
const kCredits = (userId: string) => `credits:${userId}`;
const kTrialGranted = (userId: string) => `trial:granted:${userId}`;
const kDailyUsed = (userId: string, ymd: string) => `credits:dailyUsed:${userId}:${ymd}`;
const kRegen = (userId: string, sessionHash: string) => `regen:${userId}:${sessionHash}`;

export type DebitResult = {
  ok: boolean;
  remaining: number;
  dailyRemaining?: number;
  reason?: string;
};

export const todayYMD = () => {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
};

export async function getCredits(userId: string): Promise<number> {
  const v = await redis.get<number | null>(kCredits(userId));
  return typeof v === "number" ? v : 0;
}

export async function awardCredits(userId: string, amount: number): Promise<number> {
  const newBal = await redis.incrby(kCredits(userId), amount);
  return newBal;
}

export async function ensureTrial(userId: string, trialCredits = 2): Promise<{ granted: boolean; balance: number }>{
  const set = await redis.set(kTrialGranted(userId), "1", { nx: true });
  if (set === "OK") {
    const bal = await awardCredits(userId, trialCredits);
    return { granted: true, balance: bal };
  }
  const bal = await getCredits(userId);
  return { granted: false, balance: bal };
}

export async function getDailyUsage(userId: string): Promise<number> {
  const used = await redis.get<number | null>(kDailyUsed(userId, todayYMD()));
  return typeof used === "number" ? used : 0;
}

export async function getDailyRemaining(userId: string, dailyCap: number): Promise<number> {
  const used = await getDailyUsage(userId);
  return Math.max(0, dailyCap - used);
}

export async function tryDebit(
  userId: string,
  amount: number,
  opts?: { dailyCap?: number }
): Promise<DebitResult> {
  const dailyCap = opts?.dailyCap ?? Infinity;
  if (Number.isFinite(dailyCap)) {
    const remainingToday = await getDailyRemaining(userId, dailyCap as number);
    if (remainingToday < amount) {
      return { ok: false, remaining: await getCredits(userId), dailyRemaining: remainingToday, reason: "daily-cap-exceeded" };
    }
  }

  const newBal = await redis.decrby(kCredits(userId), amount);
  if (newBal < 0) {
    await redis.incrby(kCredits(userId), amount); // revert
    return { ok: false, remaining: 0, reason: "insufficient-credits" };
  }

  // increment daily usage and set TTL to end-of-day (~48h safety)
  const key = kDailyUsed(userId, todayYMD());
  const used = await redis.incrby(key, amount);
  // ensure key expires in ~2 days to avoid unbounded growth (172800 seconds)
  await redis.expire(key, 172800);
  const dailyRemaining = Number.isFinite(dailyCap) ? Math.max(0, (dailyCap as number) - used) : undefined;

  return { ok: true, remaining: newBal, dailyRemaining };
}

export async function refund(userId: string, amount: number): Promise<number> {
  return await awardCredits(userId, amount);
}

export function sessionHashFromPrompt(prompt: string): string {
  // DJB2 hash (string → 32-bit) then hex
  let h = 5381;
  for (let i = 0; i < prompt.length; i++) {
    h = ((h << 5) + h) + prompt.charCodeAt(i);
    h |= 0; // force 32-bit
  }
  // Convert to unsigned and hex; pad to 8
  const hex = (h >>> 0).toString(16).padStart(8, '0');
  return hex;
}

export async function getRegenCount(userId: string, sessionHash: string): Promise<number> {
  const v = await redis.get<number | null>(kRegen(userId, sessionHash));
  return typeof v === "number" ? v : 0;
}

export async function incrementRegen(userId: string, sessionHash: string, ttlSeconds = 86400): Promise<number> {
  const key = kRegen(userId, sessionHash);
  const next = await redis.incr(key);
  if (next === 1) {
    await redis.expire(key, ttlSeconds);
  }
  return next;
}
