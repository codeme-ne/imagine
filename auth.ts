import NextAuth from "next-auth"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { Redis } from "@upstash/redis"
import Resend from "next-auth/providers/resend"
import { authConfig } from "./auth.config"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Edge-kompatible Basis-Konfiguration
  adapter: UpstashRedisAdapter(redis),
  // Stellt sicher, dass die Middleware den Login-Zustand ohne DB-Zugriff erkennt
  session: { strategy: "jwt" },
  providers: [
    Resend({
      // Verwendet Resend API direkt, kein Nodemailer!
      // apiKey wird automatisch aus AUTH_RESEND_KEY gelesen
      from: process.env.EMAIL_FROM!,
    }),
  ],
})
