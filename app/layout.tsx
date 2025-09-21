import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/auth-provider";
import AppToaster from "@/components/app-toaster";
import { UserInfo } from "@/components/auth-components";
import SignInLink from "@/components/sign-in-link";
import { auth } from "@/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "URL → Image",
  description: "Turn any website into a beautiful image with AI.",
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
    <header className="p-3 border-b">
      <div className="mx-auto max-w-6xl w-full flex items-center justify-end gap-2">
        {session?.user ? <UserInfo /> : <SignInLink />}
      </div>
    </header>
  )
}
