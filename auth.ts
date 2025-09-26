import NextAuth from "next-auth"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { Redis } from "@upstash/redis"
import Resend from "next-auth/providers/resend"
import { authConfig } from "./auth.config"

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
const resendApiKey = process.env.AUTH_RESEND_KEY ?? process.env.RESEND_API_KEY
const emailFrom = process.env.EMAIL_FROM
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

const missingEnv = [
  !redisUrl && "UPSTASH_REDIS_REST_URL",
  !redisToken && "UPSTASH_REDIS_REST_TOKEN",
  !resendApiKey && "AUTH_RESEND_KEY (or RESEND_API_KEY)",
  !emailFrom && "EMAIL_FROM",
  !authSecret && "AUTH_SECRET (or NEXTAUTH_SECRET)",
].filter(Boolean) as string[]

if (missingEnv.length) {
  throw new Error(`Missing environment variables for Auth.js: ${missingEnv.join(", ")}`)
}

const redis = new Redis({
  url: redisUrl!,
  token: redisToken!,
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Edge-kompatible Basis-Konfiguration
  secret: authSecret,
  adapter: UpstashRedisAdapter(redis),
  // Stellt sicher, dass die Middleware den Login-Zustand ohne DB-Zugriff erkennt
  session: { strategy: "jwt" },
  providers: [
    Resend({
      apiKey: resendApiKey!,
      from: emailFrom!,
    }),
  ],
})
