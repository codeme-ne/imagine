import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "./ui/button";

export async function SignIn() {
  return (
    <Button asChild variant="outline">
      <Link href="/auth/signin">Sign in</Link>
    </Button>
  )
}

export async function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit" variant="outline">Sign out</Button>
      
      
    </form>
  );
}

export async function UserInfo() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{session.user.email}</span>
      <SignOut />
    </div>
  )
}
