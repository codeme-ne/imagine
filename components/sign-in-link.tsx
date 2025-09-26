"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignInLink() {
  const pathname = usePathname();
  const hidden = pathname?.startsWith("/auth");

  return (
    <Button
      asChild
      variant="outline"
      className={hidden ? "invisible pointer-events-none" : undefined}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
    >
      <Link href="/auth/signin">Sign in</Link>
    </Button>
  );
}
