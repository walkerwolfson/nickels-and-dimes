import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ensureDefaultClubMembership } from "@/lib/default-club";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const cookieStore = await cookies();
      const marketingCookie = cookieStore.get("marketing_opt_in")?.value === "true";
      const marketingOptIn = Boolean(user.user_metadata?.marketing_opt_in) || marketingCookie;
      const displayName =
        user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Athlete";

      await prisma.profile.upsert({
        where: { id: user.id },
        create: { id: user.id, email: user.email, displayName, marketingOptIn },
        update: { email: user.email },
      });
      await ensureDefaultClubMembership(user.id);

      const response = NextResponse.redirect(`${origin}${next}`);
      response.cookies.set("marketing_opt_in", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=1`);
}
