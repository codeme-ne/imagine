import NextAuth from "next-auth"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { Redis } from "@upstash/redis"
import EmailProvider from "next-auth/providers/email"
import { Resend } from "resend"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const resend = new Resend(process.env.RESEND_API_KEY!)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: UpstashRedisAdapter(redis),
  providers: [
    EmailProvider({
      server: "", // Dummy server für Resend
      from: process.env.EMAIL_FROM!,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: email,
            subject: '🔗 Dein Magic Link für pagetopic.org',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>🔗 Anmeldung bei pagetopic.org</h2>
                <p>Klicke auf den Button unten, um dich anzumelden:</p>
                <a href="${url}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  🚀 Jetzt anmelden
                </a>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                  Oder kopiere diesen Link: <br>
                  <code style="background: #f5f5f5; padding: 4px; word-break: break-all;">${url}</code>
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                  Falls du diese Anmeldung nicht angefordert hast, ignoriere diese Email.
                </p>
              </div>
            `
          });
          console.log(`✅ Magic Link sent to ${email}`);
        } catch (error) {
          console.error('❌ Error sending email:', error);
          throw error;
        }
      }
    }),
  ],
})
