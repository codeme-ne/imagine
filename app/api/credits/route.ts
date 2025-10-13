import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ensureTrial, getCredits, getDailyRemaining } from "@/lib/credits";
import { getUserId } from "@/lib/auth-utils";
import { handleEdgeError, ErrorType } from "@/lib/error-handler";
import { USAGE_LIMITS } from "@/lib/security-constants";

export const runtime = "edge";

export async function GET() {
  try {
    const session = await auth();
    const userId = getUserId(session);
    
    if (!userId) {
      return handleEdgeError(
        new Error('User not authenticated'),
        ErrorType.AUTHENTICATION,
        'credits-api'
      );
    }

    // Grant free trial on first login/access
    await ensureTrial(userId, USAGE_LIMITS.TRIAL_CREDITS);

    const [balance, dailyRemaining] = await Promise.all([
      getCredits(userId),
      getDailyRemaining(userId, USAGE_LIMITS.DAILY_IMAGE_CAP),
    ]);

    return NextResponse.json({ 
      credits: balance, 
      dailyRemaining, 
      dailyCap: USAGE_LIMITS.DAILY_IMAGE_CAP 
    });
  } catch (error) {
    return handleEdgeError(error, ErrorType.SERVER_ERROR, 'credits-api');
  }
}
