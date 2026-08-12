"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { fmtTime } from "@/lib/domain";

export function ShareWorkoutButton({
  lines,
  time,
  durationSec,
}: {
  lines: string[];
  time: string;
  durationSec?: number | null;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = "https://nickelsanddimes.app";
    const text = `Just logged ${lines.join(", ")} on Nickels & Dimes`;
    const params = new URLSearchParams({ date: time, lines: lines.join("|") });
    if (durationSec) params.set("duration", fmtTime(durationSec));
    const imageUrl = `/api/share-card?${params.toString()}`;

    // Prefer sharing the branded workout image when the platform supports file sharing
    // (iOS/Android share sheets do — this is what lets it land nicely in Instagram Stories).
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], "workout.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Nickels & Dimes", text });
        return;
      }
    } catch {
      // Image fetch/share failed — fall through to a text-only share.
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: "Nickels & Dimes", text, url });
      } catch {
        // User cancelled the share sheet — no-op.
      }
      return;
    }

    await navigator.clipboard.writeText(`${text} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-1.5 p-2 -m-2 touch-manipulation transition-transform duration-100 active:scale-90"
    >
      {copied ? (
        <>
          <Check size={15} color="var(--purple-deep)" />
          <span className="font-data text-xs">Copied!</span>
        </>
      ) : (
        <Share2 size={15} />
      )}
    </button>
  );
}
