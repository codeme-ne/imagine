import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { isRateLimited } from '@/lib/rate-limit';
import { auth } from '@/auth';
import {
  ensureTrial,
  tryDebit,
  refund,
  getCredits,
  getDailyRemaining,
  sessionHashFromPrompt,
  getRegenCount,
  incrementRegen,
} from '@/lib/credits';
import { getUserId } from '@/lib/auth-utils';
import { imagen4RequestSchema } from '@/lib/validations/api-schemas';
import { handleNextError, ErrorType } from '@/lib/error-handler';

interface FalImage {
  url: string;
  content_type?: string;
  width?: number;
  height?: number;
}

interface FalResponseData {
  images?: FalImage[];
  [key: string]: unknown;
}

interface FalResponse {
  data?: FalResponseData;
  status?: string;
  logs?: Array<{ message: string }>;
  [key: string]: unknown;
}

interface ApiError extends Error {
  status?: number;
}

export async function POST(request: NextRequest) {
  try {
    const DAILY_CAP = 100; // images per day
    const MAX_TOTAL_PER_PROMPT = 4; // 1 initial + 3 regenerations

    const rateLimit = await isRateLimited(request, 'imagen4');
    
    if (!rateLimit.success) {
      return handleNextError(
        new Error('Rate limit exceeded'),
        ErrorType.RATE_LIMIT,
        'imagen4-api',
        { limit: rateLimit.limit, remaining: rateLimit.remaining }
      );
    }

    // Require authenticated user for debit/credits
    const session = await auth();
    const userId = getUserId(session);
    
    if (!userId) {
      return handleNextError(
        new Error('User not authenticated'),
        ErrorType.AUTHENTICATION,
        'imagen4-api'
      );
    }

    // Grant free trial (1 credit) once per user on first use
    await ensureTrial(userId, 1);

    let apiKey = process.env.FAL_KEY;
    
    if (!apiKey) {
      const headerApiKey = request.headers.get('X-Fal-API-Key');
      
      if (!headerApiKey) {
        return handleNextError(
          new Error('Fal.ai API key not configured'),
          ErrorType.SERVER_ERROR,
          'imagen4-api'
        );
      }
      
      apiKey = headerApiKey;
    }
    
    fal.config({
      credentials: apiKey,
    });

    // Validate request body
    let prompt: string;
    try {
      const rawBody = await request.json();
      const validated = imagen4RequestSchema.safeParse(rawBody);
      
      if (!validated.success) {
        return handleNextError(
          new Error(validated.error.errors[0]?.message || 'Invalid request'),
          ErrorType.VALIDATION,
          'imagen4-api',
          { errors: validated.error.errors }
        );
      }
      
      prompt = validated.data.prompt;
    } catch (parseError) {
      return handleNextError(
        parseError,
        ErrorType.VALIDATION,
        'imagen4-api',
        { message: 'Failed to parse request body' }
      );
    }

    // Regeneration policy: limit to 1 initial + 3 extra for the same prompt (rolling 24h)
    const sessionHash = sessionHashFromPrompt(prompt);
    const currentCount = await getRegenCount(userId, sessionHash);
    if (currentCount >= MAX_TOTAL_PER_PROMPT) {
      return handleNextError(
        new Error('Regeneration limit reached'),
        ErrorType.RATE_LIMIT,
        'imagen4-api',
        { sessionHash, currentCount, maxAllowed: MAX_TOTAL_PER_PROMPT }
      );
    }

    // Debit exactly 1 credit (image generation). Enforce daily cap.
    const debit = await tryDebit(userId, 1, { dailyCap: DAILY_CAP });
    if (!debit.ok) {
      const remaining = debit.remaining ?? (await getCredits(userId));
      if (debit.reason === 'daily-cap-exceeded') {
        return NextResponse.json({
          error: 'Daily image limit reached. Try again tomorrow.',
          remaining,
          dailyRemaining: 0,
        }, {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-Credits-Remaining': String(remaining),
            'X-Daily-Remaining': '0',
          }
        });
      }

      return NextResponse.json({
        error: 'You are out of credits.',
        remaining,
      }, {
        status: 402,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-Credits-Remaining': String(remaining),
        }
      });
    }

    // After successful debit, record this generation for the prompt session
    await incrementRegen(userId, sessionHash, 86400);

    const result = await fal.subscribe("fal-ai/imagen4/preview", {
      input: {
        prompt: prompt,
      },
      logs: true,
    }) as FalResponse;

    const images = result?.data?.images;

    if (!images || images.length === 0 || !images[0].url) {
      // Refund on provider failure
      await refund(userId, 1);
      return handleNextError(
        new Error('Fal.ai did not return a valid image'),
        ErrorType.API_ERROR,
        'imagen4-api'
      );
    }

    const imageUrl = images[0].url;
    const imageContentType = images[0].content_type;


    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      await refund(userId, 1);
      return handleNextError(
        new Error(`Failed to fetch image: ${imageResponse.status}`),
        ErrorType.API_ERROR,
        'imagen4-api',
        { imageResponseStatus: imageResponse.status }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const dailyRemaining = await getDailyRemaining(userId, DAILY_CAP);

    return NextResponse.json({
      imageBase64: imageBase64,
      contentType: imageContentType || 'image/png',
      falResponse: result
    }, {
      headers: {
        'X-Credits-Remaining': String(debit.remaining),
        'X-Daily-Remaining': String(dailyRemaining),
      }
    });

  } catch (error: unknown) {
    const err = error as ApiError;
    if (err.message && err.message.includes("FAL_KEY")) {
      return handleNextError(
        error,
        ErrorType.SERVER_ERROR,
        'imagen4-api',
        { message: 'API configuration error' }
      );
    }
    return handleNextError(error, ErrorType.API_ERROR, 'imagen4-api');
  }
}
