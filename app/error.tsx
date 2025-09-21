"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md p-6 text-center">
      <h2 className="text-lg font-semibold">Etwas ist schiefgelaufen.</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message || "Unerwarteter Fehler."}</p>
      <button onClick={() => reset()} className="mt-4 inline-flex h-10 items-center rounded-[10px] border px-4 text-sm">
        Erneut versuchen
      </button>
    </div>
  );
}

