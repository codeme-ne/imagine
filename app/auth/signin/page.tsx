import { signIn } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MagicLinkForm from "@/components/magic-link-form";

type SignInPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const callbackUrlParam = typeof resolvedSearchParams.callbackUrl === "string" ? resolvedSearchParams.callbackUrl : undefined;
  const planParam = typeof resolvedSearchParams.plan === "string" ? resolvedSearchParams.plan : undefined;
  const promoParam = typeof resolvedSearchParams.promo === "string" ? resolvedSearchParams.promo : undefined;
  const defaultRedirect = "/?welcome=1";
  const safeCallbackUrl = callbackUrlParam && callbackUrlParam.startsWith("/") ? callbackUrlParam : defaultRedirect;
  const checkoutHint = planParam
    ? `After confirming the link you'll return to checkout for plan "${planParam}"${promoParam ? ` with promo ${promoParam}` : ""}.`
    : null;

  async function signInAction(
    _prevState: { ok: boolean; error?: string },
    formData: FormData
  ) {
    "use server";
    const email = formData.get("email") as string;
    try {
      await signIn("resend", {
        email,
        redirectTo: safeCallbackUrl,
        redirect: false
      });
      return { ok: true as const };
    } catch (e) {
      let message = "Sending failed. Please try again later.";
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
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your email to receive a magic link.
          </CardDescription>
          {checkoutHint && (
            <p className="text-sm text-muted-foreground">{checkoutHint}</p>
          )}
        </CardHeader>
        <CardContent>
          <MagicLinkForm action={signInAction} />
        </CardContent>
      </Card>
    </div>
  );
}
