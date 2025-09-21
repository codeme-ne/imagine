import { signIn } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MagicLinkForm from "@/components/magic-link-form";

export default function SignInPage() {
  async function signInAction(
    _prevState: { ok: boolean; error?: string },
    formData: FormData
  ) {
    "use server";
    const email = formData.get("email") as string;
    try {
      await signIn("resend", {
        email,
        redirectTo: "/?welcome=1",  // Nach erfolgreicher Authentifizierung zur Hauptseite weiterleiten (mit Toast-Flag)
        redirect: false   // Server Action selbst soll nicht weiterleiten
      });
      return { ok: true as const };
    } catch (e) {
      let message = "Senden fehlgeschlagen. Bitte später erneut versuchen.";
      if (e instanceof Error) {
        message = e.message;
      }
      return { ok: false as const, error: message };
    }
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Anmelden</CardTitle>
          <CardDescription>
            Geben Sie Ihre E-Mail-Adresse ein, um einen Magic Link zu erhalten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MagicLinkForm action={signInAction} />
        </CardContent>
      </Card>
    </div>
  );
}
