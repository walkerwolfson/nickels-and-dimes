"use client";

import { useEffect, useState } from "react";
import { X, Share } from "lucide-react";

const DISMISSED_KEY = "nd-install-prompt-dismissed";

export function InstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const nav = navigator as Navigator & { standalone?: boolean };
    const isStandalone = nav.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
    const dismissed = localStorage.getItem(DISMISSED_KEY) === "1";

    if (isIOS && !isStandalone && !dismissed) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="mx-5 mt-3 flex items-center gap-3 rounded-[10px] border-[1.5px] border-border bg-surface p-3.5">
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--purple-soft)" }}
      >
        <Share size={16} color="var(--purple-deep)" />
      </div>
      <span className="flex-1 text-[12.5px] leading-snug text-text-dim">
        Add Nickels &amp; Dimes to your Home Screen: tap{" "}
        <Share size={12} className="inline" style={{ verticalAlign: "-1px" }} /> then{" "}
        <span className="font-semibold text-text">Add to Home Screen</span>.
      </span>
      <button onClick={dismiss} className="flex-shrink-0 text-text-faint">
        <X size={16} />
      </button>
    </div>
  );
}
