import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

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
    <ClerkProvider>
      <html lang="de" suppressHydrationWarning>
        <body
          suppressHydrationWarning={true}
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable
          )}
        >
          <header className="p-3 border-b">
            <div className="mx-auto max-w-6xl flex items-center justify-end gap-2">
              <SignedOut>
                <SignInButton>
                  <Button variant="outline" className="cursor-pointer">Sign in</Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="cursor-pointer">Sign up</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-2">
                  <SignOutButton>
                    <Button variant="outline" className="cursor-pointer">Sign out</Button>
                  </SignOutButton>
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </header>
          <main className="">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
