import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
import { streamText } from 'ai';
import { isRateLimited } from '@/lib/rate-limit';
import { auth } from '@/auth';
import { ensureTrial, getCredits } from '@/lib/credits';
import { NextRequest } from 'next/server';

// NOTE: [Performance] Caching considered but not implemented - streaming responses + unique prompts per URL make caching overhead > benefit
// Trade-off analysis: Would require buffering entire stream before caching, prompts are typically unique per URL, users expect fresh generations

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const rateLimit = await isRateLimited(req, 'gemini');
    if (!rateLimit.success) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          },
        },
      );
    }

    // Enforce auth + credits gating (no debit here, just gate expensive ops)
    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const user = session.user as { id?: string; email?: string };
    const userId = user.id || user.email || '';
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    // Grant 1 trial credit once (Imagen will actually debit; here we just make sure badge initializes)
    await ensureTrial(userId, 1);
    const creditBalance = await getCredits(userId);
    if (creditBalance <= 0) {
      return new Response(JSON.stringify({ error: 'You are out of credits. Buy credits to continue.' }), {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'X-Credits-Remaining': '0',
        },
      });
    }

    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      undefined;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'API configuration error. Please try again later or contact support.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // -------------- Model selection with fallbacks --------------
    const headerModel = req.headers.get('X-Gemini-Model') || undefined;
    const envModel =
      process.env.GEMINI_MODEL_ID ||
      process.env.GOOGLE_MODEL_ID ||
      undefined;
    // Prefer a thinking-capable default model so reasoning streams when available
    const modelId = headerModel || envModel || 'gemini-2.5-flash-preview-05-20';

    // -------------- AI call with streaming --------------
    // Create a provider instance with the resolved API key
    const googleProvider = createGoogleGenerativeAI({ apiKey });

    const result = await streamText({
      model: googleProvider(modelId),
      // Ask the provider to include reasoning/thinking tokens when supported
      providerOptions: {
        google: {
          // Newer SDKs: some variants support thinking/structured reasoning
          // Older/preview SDKs: use thinkingConfig as in previous working code
          thinkingConfig: {
            includeThoughts: true,
            thinkingBudget: 2048,
          },
        } satisfies GoogleGenerativeAIProviderOptions,
      },
      prompt,
    });

    const encoder = new TextEncoder();

    const aiStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.fullStream) {
            controller.enqueue(chunk);
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    const transformStream = new TransformStream({
      // No debug preface; only stream provider events
      start() {},
      transform(chunk: unknown, controller) {
        try {
          // Normalize various possible shapes from AI SDK
          let evt: unknown = chunk;

          // If we ever receive a Uint8Array/string, try to decode/parse it
          if (evt instanceof Uint8Array) {
            const text = new TextDecoder().decode(evt);
            try {
              evt = JSON.parse(text);
            } catch {
              // Treat as plain text delta
              if (process.env.NODE_ENV !== 'production') {
                console.log('[Gemini stream] plain text chunk');
              }
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({ type: 'text-delta', textDelta: text }) + '\n',
                ),
              );
              return;
            }
          } else if (typeof evt === 'string') {
            try {
              evt = JSON.parse(evt);
            } catch {
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({ type: 'text-delta', textDelta: evt }) + '\n',
                ),
              );
              return;
            }
          }

          // Safe helpers to access properties without using `any`
          const getProp = <T>(obj: unknown, key: string): T | undefined => {
            if (obj && typeof obj === 'object' && key in (obj as Record<string, unknown>)) {
              return (obj as Record<string, unknown>)[key] as T;
            }
            return undefined;
          };

          const t: string =
            getProp<string>(evt, 'type') ||
            getProp<string>(evt, 'event') ||
            getProp<string>(evt, 'name') ||
            '';

          if (process.env.NODE_ENV !== 'production') {
            try {
              const loggedType = t || typeof chunk;
              console.log('[Gemini stream] event type:', loggedType);
            } catch {}
          }

          // Surface any provider error as thinking, so the UI shows feedback
          const isError = t === 'error' || t === 'response.error' || t.includes('error');
          if (isError) {
            const message =
              getProp<string>(evt, 'message') ||
              getProp<string>(evt, 'error') ||
              getProp<string>(evt, 'data') ||
              getProp<string>(evt, 'detail') ||
              'Unknown error';
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ type: 'thinking', value: `Provider error: ${String(message)}` }) + '\n',
              ),
            );
            return;
          }

          // Emit provider "reasoning/thinking" deltas as thinking events for the UI
          const isReasoning =
            t === 'reasoning' ||
            t === 'reasoning.delta' ||
            t === 'response.output_text.reasoning.delta' ||
            t.includes('reasoning');
          if (isReasoning) {
            const rd = getProp<{ text?: string }>(evt, 'reasoningDelta');
            const thinkingText: string =
              getProp<string>(evt, 'textDelta') ||
              getProp<string>(evt, 'delta') ||
              getProp<string>(evt, 'value') ||
              getProp<string>(evt, 'text') ||
              (rd?.text ?? '') ||
              '';

            // Strip common markdown formatting/headings to keep UI clean
            const sanitizeThinking = (text: string) => {
              let s = text;
              // Remove a leading bold heading like **Title** and the following blank line(s)
              s = s.replace(/^\s*\*\*[^\n]+\*\*\s*\n?/g, '');
              // Remove markdown bold/italic/code markers
              s = s.replace(/\*\*([^*]+)\*\*/g, '$1');
              s = s.replace(/\*([^*]+)\*/g, '$1');
              s = s.replace(/`([^`]+)`/g, '$1');
              // Demote markdown headings like # Title
              s = s.replace(/^#+\s+(.+)$/gm, '$1');
              return s.trim();
            };

            const clean = sanitizeThinking(String(thinkingText));

            if (clean.length > 0) {
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({ type: 'thinking', value: clean }) + '\n',
                ),
              );
            }
            return;
          }

          // Output text deltas (final content prompt)
          const isTextDelta =
            t === 'text.delta' ||
            t === 'text-delta' ||
            t === 'text' ||
            t === 'response.delta' ||
            t === 'response.output_text.delta' ||
            t.includes('text') ||
            t.includes('delta');

          if (isTextDelta) {
            const textDelta: string =
              getProp<string>(evt, 'textDelta') ||
              getProp<string>(evt, 'delta') ||
              getProp<string>(evt, 'value') ||
              getProp<string>(evt, 'content') ||
              getProp<string>(evt, 'text') ||
              '';

            if (textDelta && String(textDelta).length > 0) {
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({ type: 'text-delta', textDelta: String(textDelta) }) + '\n',
                ),
              );
            }
            return;
          }
        } catch (err) {
          console.error('Error processing chunk:', err);
        }
      },
      flush(controller) {
        controller.enqueue(encoder.encode(JSON.stringify({ type: 'done' }) + '\n'));
      },
    });

    const ndjsonStream = aiStream.pipeThrough(transformStream);

    return new Response(ndjsonStream, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error in Gemini API route:', err);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request. Please try again later.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
