import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAppRoute = createRouteMatcher(["/"]); // Protect the app interface at root
const isLanding = createRouteMatcher(["/landing"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Require auth for the app interface
  if (isAppRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/landing", req.url));
    }
  }

  // If a signed-in user hits /landing, send them to the app
  if (userId && isLanding(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
