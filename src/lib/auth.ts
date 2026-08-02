import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { DEMO_USER_ID } from "@/lib/demo-user";

// Falls back to the placeholder demo account only when Supabase isn't configured at all
// (local dev before credentials exist). Once configured, every request goes through a
// real authenticated user — proxy.ts guarantees a session exists on protected routes.
//
// Wrapped in React's cache() so the layout and page (both of which need the current user)
// only trigger one Supabase Auth network call per request instead of two.
export const getCurrentUserId = cache(async (): Promise<string> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return DEMO_USER_ID;
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? DEMO_USER_ID;
});
