"use server";

import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type AuthState = { error?: string; success?: boolean };

export async function sendMagicLink(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim();
  const marketingOptIn = formData.get("marketingOptIn") === "on";

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { marketing_opt_in: marketingOptIn },
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

// Called client-side right after supabase.auth.verifyOtp() succeeds in the browser (the
// same-tab 6-digit-code flow) — creates the Profile row on first login and applies the
// marketing-opt-in choice, mirroring what /auth/callback does for the link-click flow.
// Needed because verifyOtp completes the session directly in the browser and never hits
// that route.
export async function completeOtpLogin(): Promise<{ error?: string; isNewUser?: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Sign-in didn't complete. Try again." };
  }

  const cookieStore = await cookies();
  const marketingCookie = cookieStore.get("marketing_opt_in")?.value === "true";
  const marketingOptIn = Boolean(user.user_metadata?.marketing_opt_in) || marketingCookie;
  const displayName =
    user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Athlete";

  const existing = await prisma.profile.findUnique({ where: { id: user.id }, select: { id: true } });

  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, email: user.email, displayName, marketingOptIn },
    update: { email: user.email },
  });

  cookieStore.set("marketing_opt_in", "", { maxAge: 0, path: "/" });
  return { isNewUser: !existing };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
