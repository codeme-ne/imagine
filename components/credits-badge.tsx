"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type CreditsInfo = {
  credits: number;
  dailyRemaining: number; // kept for backend needs; not shown
  dailyCap: number;       // kept for backend needs; not shown
};

export default function CreditsBadge() {
  const [info, setInfo] = useState<CreditsInfo | null>(null);
  // lightweight fetch without explicit loading indicator
  const [buying, setBuying] = useState<null | "starter" | "creator" | "pro">(null);

  const load = async () => {
    try {
      const res = await fetch("/api/credits", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as CreditsInfo;
      setInfo(data);
    } catch {}
  };

  useEffect(() => {
    load();
    // Refresh on window focus (user returns to tab)
    const onFocus = () => { load(); };
    window.addEventListener('focus', onFocus);
    // Listen for app-wide credits updates
    const onCreditsUpdate = (e: Event) => {
      const ce = e as CustomEvent<number>;
      const newCredits = typeof ce.detail === 'number' ? ce.detail : undefined;
      if (typeof newCredits === 'number') {
        setInfo((prev) => prev ? { ...prev, credits: newCredits } : { credits: newCredits, dailyRemaining: 0, dailyCap: 0 });
      }
    };
    window.addEventListener('credits:update', onCreditsUpdate as EventListener);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('credits:update', onCreditsUpdate as EventListener);
    };
  }, []);

  const startCheckout = async (pack: "starter" | "creator" | "pro") => {
    try {
      setBuying(pack);
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="rounded-md border px-2.5 py-1 text-xs text-foreground bg-card">
        Credits: <span className="font-semibold">{info?.credits ?? "—"}</span>
      </div>
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => startCheckout("starter")} disabled={!!buying}>
          {buying === "starter" ? "…" : "Buy Starter"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => startCheckout("creator")} disabled={!!buying}>
          {buying === "creator" ? "…" : "Creator"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => startCheckout("pro")} disabled={!!buying}>
          {buying === "pro" ? "…" : "Pro"}
        </Button>
      </div>
    </div>
  );
}
