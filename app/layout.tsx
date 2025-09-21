import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/auth-provider";
import { SignIn, UserInfo } from "@/components/auth-components";
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
        <AuthProvider>
          <Header />
          <main className="">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

async function Header() {
  const session = await auth();
  return (
    <header className="p-3 border-b">
      <div className="mx-auto max-w-6xl flex items-center justify-end gap-2">
        {session?.user ? <UserInfo /> : <SignIn />}
      </div>
    </header>
  )
}
