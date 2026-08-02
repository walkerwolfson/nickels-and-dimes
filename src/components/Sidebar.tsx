"use client";

import { useState } from "react";
import Link from "next/link";
import { X, User, Settings, Globe, ChevronRight } from "lucide-react";

export function Sidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
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
          <button onClick={() => setOpen(false)} className="text-text-dim">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col px-3">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-[10px] px-3 py-3 text-text"
          >
            <User size={18} color="var(--purple-deep)" />
            <span className="text-[14px] font-semibold">Profile</span>
            <ChevronRight size={15} className="ml-auto text-text-faint" />
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-[10px] px-3 py-3 text-text"
          >
            <Settings size={18} color="var(--purple-deep)" />
            <span className="text-[14px] font-semibold">Settings</span>
            <ChevronRight size={15} className="ml-auto text-text-faint" />
          </Link>

          <div className="mt-2 flex items-center gap-3 rounded-[10px] px-3 py-3" style={{ opacity: 0.5 }}>
            <Globe size={18} color="var(--text-faint)" />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-text">Global Rank</span>
              <span className="font-data text-[10px] text-text-faint">Coming Soon!</span>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
