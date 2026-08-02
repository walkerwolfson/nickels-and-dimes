"use client";

import { useActionState, useState } from "react";
import { Mail } from "lucide-react";
import { sendMagicLink, type AuthState } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { GoogleIcon } from "@/components/auth/GoogleIcon";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, initialState);
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [googlePending, setGooglePending] = useState(false);

  async function handleGoogle() {
    setGooglePending(true);
    document.cookie = `marketing_opt_in=${marketingOptIn}; path=/; max-age=600`;
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "var(--yellow)" }}
        >
          <Mail size={26} color="#2B2E00" />
        </div>
        <span className="font-display text-xl uppercase text-text">Check your email</span>
        <span className="max-w-xs text-sm text-text-dim">
          We sent you a sign-in link. Open it on this device to finish logging in.
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <form action={formAction} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="font-data text-xs tracking-wide text-text-dim">EMAIL</span>
          <input
            name="email"
            type="email"
            required
            autoFocus
            placeholder="you@example.com"
            className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[15px] text-text outline-none"
          />
        </div>

        <label className="flex items-start gap-2.5 py-1">
          <input
            type="checkbox"
            name="marketingOptIn"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
            style={{ accentColor: "var(--purple)" }}
            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-border"
          />
          <span className="text-[12.5px] leading-snug text-text-dim">
            Keep me posted on new features, challenges, and club news by email.
          </span>
        </label>

        {state.error && <span className="text-[12.5px] text-pink">{state.error}</span>}

        <button
          type="submit"
          disabled={pending}
          className="py-3.5 font-display text-[15px] uppercase text-white"
          style={{ background: "var(--purple)", borderRadius: 12, opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Sending…" : "Continue with email"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        <span className="font-data text-[11px] text-text-faint">OR</span>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <button
        onClick={handleGoogle}
        disabled={googlePending}
        className="flex items-center justify-center gap-2.5 border-[1.5px] border-border bg-surface py-3.5 text-[14px] font-semibold text-text"
        style={{ borderRadius: 12, opacity: googlePending ? 0.6 : 1 }}
      >
        <GoogleIcon />
        {googlePending ? "Redirecting…" : "Continue with Google"}
      </button>
    </div>
  );
}
