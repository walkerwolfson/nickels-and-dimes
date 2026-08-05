"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { sendMagicLink, completeOtpLogin, type AuthState } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { GoogleIcon } from "@/components/auth/GoogleIcon";
import { MicrosoftIcon } from "@/components/auth/MicrosoftIcon";

const initialState: AuthState = {};

function CodeEntry({ email }: { email: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    if (verifyError) {
      setError("That code didn't work — check it and try again.");
      setPending(false);
      return;
    }

    const { error: completeError } = await completeOtpLogin();
    if (completeError) {
      setError(completeError);
      setPending(false);
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="font-data text-xs tracking-wide text-text-dim">6-DIGIT CODE</span>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-center text-xl tracking-[0.3em] text-text outline-none"
        />
      </div>
      {error && <span className="text-[12.5px] text-pink">{error}</span>}
      <button
        type="submit"
        disabled={pending || code.length !== 6}
        className="py-3.5 font-display text-[15px] uppercase text-white"
        style={{ background: "var(--purple)", borderRadius: 12, opacity: pending || code.length !== 6 ? 0.6 : 1 }}
      >
        {pending ? "Verifying…" : "Verify code"}
      </button>
    </form>
  );
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, initialState);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [oauthPending, setOauthPending] = useState<"google" | "azure" | null>(null);
  const [email, setEmail] = useState("");

  async function handleOAuth(provider: "google" | "azure") {
    setOauthPending(provider);
    document.cookie = `marketing_opt_in=${marketingOptIn}; path=/; max-age=600`;
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "var(--yellow)" }}
        >
          <Mail size={26} color="#2B2E00" />
        </div>
        <span className="font-display text-xl uppercase text-text">Check your email</span>
        <span className="max-w-xs text-sm text-text-dim">
          Click the link, or enter the 6-digit code from the email below — whichever works.
        </span>
        <div className="w-full">
          <CodeEntry email={email} />
        </div>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Send me occasional emails about new features, club challenges, and product updates.
            You can change this anytime in Settings.
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
        onClick={() => handleOAuth("google")}
        disabled={oauthPending !== null}
        className="flex items-center justify-center gap-2.5 border-[1.5px] border-border bg-surface py-3.5 text-[14px] font-semibold text-text"
        style={{ borderRadius: 12, opacity: oauthPending !== null ? 0.6 : 1 }}
      >
        <GoogleIcon />
        {oauthPending === "google" ? "Redirecting…" : "Continue with Google"}
      </button>

      <button
        onClick={() => handleOAuth("azure")}
        disabled={oauthPending !== null}
        className="flex items-center justify-center gap-2.5 border-[1.5px] border-border bg-surface py-3.5 text-[14px] font-semibold text-text"
        style={{ borderRadius: 12, opacity: oauthPending !== null ? 0.6 : 1 }}
      >
        <MicrosoftIcon />
        {oauthPending === "azure" ? "Redirecting…" : "Continue with Microsoft"}
      </button>
    </div>
  );
}
