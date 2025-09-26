import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/auth-provider";
import AppToaster from "@/components/app-toaster";
import { UserInfo } from "@/components/auth-components";
import SignInLink from "@/components/sign-in-link";
import { auth } from "@/auth";
import CreditsBadge from "@/components/credits-badge";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "URL → Image",
  description: "Turn any website into a beautiful image with AI.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {/* Render the Server Component header outside of the Client Provider
            to avoid mixing Server Components inside a Client boundary. */}
        <Header />
        <AuthProvider>
          <main className="">
            {children}
          </main>
          <AppToaster />
        </AuthProvider>
      </body>
    </html>
  );
}

async function Header() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl w-full px-3 py-2 flex items-center justify-between gap-2">
        <div className="min-w-0 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          {session?.user ? <CreditsBadge /> : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {session?.user ? <UserInfo /> : <SignInLink />}
        </div>
      </div>
    </header>
  )
}
