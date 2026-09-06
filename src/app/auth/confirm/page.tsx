"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { completeOtpLogin } from "@/lib/actions/auth";
import { track } from "@/lib/analytics";

// Requires an explicit tap before verifying, rather than exchanging the code
// the instant this page loads. Some email providers (Outlook Safe Links and
// similar corporate scanners) pre-fetch links in emails to scan them for
// phishing, which silently burns a one-time magic-link code before the real
// user ever clicks — this only shows up for non-Gmail inboxes since Gmail
// doesn't do that prefetch. Waiting for a real tap means the scanner's
// plain GET never consumes the code, only an actual click does.
function ConfirmSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!tokenHash || !type) return;
    setStatus("pending");
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "email",
    });

    if (verifyError) {
      setStatus("error");
      setError("This link already expired or was already used — enter the 6-digit code from the email instead.");
      return;
    }

    const { error: completeError, isNewUser } = await completeOtpLogin();
    if (completeError) {
      setStatus("error");
      setError(completeError);
      return;
    }

    track(isNewUser ? "sign_up" : "login", { method: "magiclink" });

    router.push("/home");
    router.refresh();
  }

  if (!tokenHash || !type) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="font-display text-xl uppercase text-text">Invalid sign-in link</span>
        <span className="max-w-xs text-sm text-text-dim">
          Head back and request a new one, or enter the 6-digit code from your email.
        </span>
        <Link href="/login" className="font-data text-xs font-bold text-purple-deep">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--yellow)" }}>
        <ShieldCheck size={26} color="#2B2E00" />
      </div>
      <span className="font-display text-xl uppercase text-text">Finish signing in</span>
      <span className="max-w-xs text-sm text-text-dim">Tap below to confirm it&apos;s really you.</span>

      {error && <span className="max-w-xs text-[12.5px] text-pink">{error}</span>}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={status === "pending"}
        className="w-full py-3.5 font-display text-[15px] uppercase text-white"
        style={{ background: "var(--purple)", borderRadius: 12, opacity: status === "pending" ? 0.6 : 1 }}
      >
        {status === "pending" ? "Signing in…" : "Confirm sign-in"}
      </button>

      {status === "error" && (
        <Link href="/login" className="font-data text-xs font-bold text-purple-deep">
          Back to sign in
        </Link>
      )}
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center px-6" style={{ background: "var(--bg)" }}>
      <Suspense fallback={null}>
        <ConfirmSignIn />
      </Suspense>
    </div>
  );
}
