"use client";

import { useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";

type ActionState = { ok: boolean; error?: string };
type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Senden…" : "Magic Link senden"}
    </Button>
  );
}

function EmailInput() {
  const { pending } = useFormStatus();
  return (
    <Input
      id="email"
      type="email"
      name="email"
      placeholder="beispiel@domain.com"
      required
      disabled={pending}
    />
  );
}

export default function MagicLinkForm({ action }: Props) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {
    ok: false,
  });

  // Optional: Fokus auf Fehlermeldung setzen, wenn vorhanden
  useEffect(() => {
    if (state?.error) {
      const el = document.getElementById("magic-link-error");
      el?.focus();
    }
  }, [state?.error]);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">E-Mail</Label>
        <EmailInput />
      </div>
      <SubmitButton />
      <div className="min-h-[1.25rem]" aria-live="polite">
        {state?.error ? (
          <p
            id="magic-link-error"
            tabIndex={-1}
            className="text-sm text-red-600"
          >
            {state.error}
          </p>
        ) : state?.ok ? (
          <p className="text-sm text-green-600">
            Magic Link gesendet. Bitte Posteingang (und Spam) prüfen.
          </p>
        ) : null}
      </div>
    </form>
  );
}
