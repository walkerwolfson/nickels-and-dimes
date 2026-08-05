"use client";

import { useState } from "react";
import { X, Globe, Lock } from "lucide-react";

export function CreateClub({
  onCreate,
  onClose,
}: {
  onCreate: (name: string, isPublic: boolean) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="absolute inset-0 z-20 flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="font-display text-2xl uppercase text-text">Create a club</h1>
        <button onClick={onClose} className="text-text-dim">
          <X size={22} />
        </button>
      </div>
      <div className="flex flex-col gap-2 px-5">
        <span className="font-data text-xs tracking-wide text-text-dim">CLUB NAME</span>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sunday Morning Crew"
          className="w-full rounded-[10px] border-[1.5px] border-border bg-surface px-3.5 py-3 text-[15px] text-text outline-none"
        />
      </div>

      <div className="mt-6 flex flex-col gap-2 px-5">
        <span className="font-data text-xs tracking-wide text-text-dim">VISIBILITY</span>
        <button
          type="button"
          onClick={() => setIsPublic(true)}
          className="flex items-center gap-3 rounded-[10px] border-[1.5px] px-4 py-3.5 text-left"
          style={{ borderColor: isPublic ? "var(--purple)" : "var(--border)", background: "var(--surface)" }}
        >
          <Globe size={18} color={isPublic ? "var(--purple-deep)" : "var(--text-faint)"} />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-text">Public</span>
            <span className="text-[11.5px] text-text-faint">Anyone can find and join from Find a club.</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setIsPublic(false)}
          className="flex items-center gap-3 rounded-[10px] border-[1.5px] px-4 py-3.5 text-left"
          style={{ borderColor: !isPublic ? "var(--purple)" : "var(--border)", background: "var(--surface)" }}
        >
          <Lock size={18} color={!isPublic ? "var(--purple-deep)" : "var(--text-faint)"} />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-text">Private</span>
            <span className="text-[11.5px] text-text-faint">Joinable only by searching the exact name or an invite link.</span>
          </div>
        </button>
      </div>

      <button
        disabled={!name.trim()}
        onClick={() => name.trim() && onCreate(name.trim(), isPublic)}
        className="mx-5 mt-auto mb-8 py-4 font-display text-base uppercase text-white"
        style={{ background: "var(--purple)", borderRadius: 12, opacity: name.trim() ? 1 : 0.4 }}
      >
        Create club
      </button>
    </div>
  );
}
