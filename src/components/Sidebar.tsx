"use client";

import { useState } from "react";
import Link from "next/link";
import { X, User, Settings, Globe, ChevronRight, Smartphone, CalendarPlus } from "lucide-react";

function AddToHomeScreenModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 px-6" style={{ background: "rgba(20,18,35,0.92)" }}>
      <button
        onClick={onClose}
        className="absolute right-5 top-6 p-2 -m-2 text-white touch-manipulation transition-transform duration-100 active:scale-90"
      >
        <X size={24} />
      </button>
      <span className="font-display text-lg uppercase text-white">Add to Home Screen</span>
      <video
        src="/help/add-to-home-screen.mp4"
        controls
        autoPlay
        muted
        loop
        playsInline
        className="w-full max-w-[280px] rounded-[16px]"
        style={{ border: "3px solid #fff" }}
      />
      <span className="max-w-xs text-center text-[13px] text-white/70">
        Tap the share icon in your browser, then tap &quot;Add to Home Screen.&quot;
      </span>
    </div>
  );
}

export function Sidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`p-2 touch-manipulation transition-transform duration-100 active:scale-90 ${className ?? ""}`}
      >
        {children}
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(33,31,53,0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-50 flex h-dvh w-[280px] flex-col border-l border-border bg-surface transition-transform duration-300 ease-out"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <span className="font-stencil text-lg uppercase tracking-wide text-text">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 -m-2 text-text-dim touch-manipulation transition-transform duration-100 active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col px-3">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-[10px] px-3 py-3 text-text touch-manipulation transition-colors duration-100 active:bg-bg"
          >
            <User size={18} color="var(--purple-deep)" />
            <span className="text-[14px] font-semibold">Profile</span>
            <ChevronRight size={15} className="ml-auto text-text-faint" />
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-[10px] px-3 py-3 text-text touch-manipulation transition-colors duration-100 active:bg-bg"
          >
            <Settings size={18} color="var(--purple-deep)" />
            <span className="text-[14px] font-semibold">Settings</span>
            <ChevronRight size={15} className="ml-auto text-text-faint" />
          </Link>
          <Link
            href="/log/backfill"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-[10px] px-3 py-3 text-text touch-manipulation transition-colors duration-100 active:bg-bg"
          >
            <CalendarPlus size={18} color="var(--purple-deep)" />
            <span className="text-[14px] font-semibold">Backfill a Workout</span>
            <ChevronRight size={15} className="ml-auto text-text-faint" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setShowVideo(true);
            }}
            className="flex items-center gap-3 rounded-[10px] px-3 py-3 text-left text-text touch-manipulation transition-colors duration-100 active:bg-bg"
          >
            <Smartphone size={18} color="var(--purple-deep)" />
            <span className="text-[14px] font-semibold">Add to Home Screen</span>
            <ChevronRight size={15} className="ml-auto text-text-faint" />
          </button>

          <div className="mt-2 flex items-center gap-3 rounded-[10px] px-3 py-3" style={{ opacity: 0.5 }}>
            <Globe size={18} color="var(--text-faint)" />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-text">Global Rank</span>
              <span className="font-data text-[10px] text-text-faint">Coming Soon!</span>
            </div>
          </div>
        </nav>
      </div>

      {showVideo && <AddToHomeScreenModal onClose={() => setShowVideo(false)} />}
    </>
  );
}
