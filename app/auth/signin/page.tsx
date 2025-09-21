import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  async function signInAction(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    await signIn("email", { email, redirect: false });
    // Hier könnten wir eine Bestätigungsmeldung anzeigen,
    // dass der Link gesendet wurde. Vorerst leiten wir
    // den Benutzer nicht um, sondern er muss seinen Posteingang überprüfen.
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Anmelden</CardTitle>
          <CardDescription>
            Geben Sie Ihre E-Mail-Adresse ein, um einen Magic Link zu erhalten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signInAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="beispiel@domain.com"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Magic Link senden
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
