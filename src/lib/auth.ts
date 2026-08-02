import "server-only";
import { createClient } from "@/lib/supabase/server";
import { DEMO_USER_ID } from "@/lib/demo-user";

// Falls back to the placeholder demo account only when Supabase isn't configured at all
// (local dev before credentials exist). Once configured, every request goes through a
// real authenticated user — proxy.ts guarantees a session exists on protected routes.
export async function getCurrentUserId(): Promise<string> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return DEMO_USER_ID;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? DEMO_USER_ID;
}
