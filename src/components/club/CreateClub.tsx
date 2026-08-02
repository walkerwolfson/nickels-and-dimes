"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function CreateClub({
  onCreate,
  onClose,
}: {
  onCreate: (name: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");

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
      <button
        disabled={!name.trim()}
        onClick={() => name.trim() && onCreate(name.trim())}
        className="mx-5 mt-auto mb-8 py-4 font-display text-base uppercase text-white"
        style={{ background: "var(--purple)", borderRadius: 12, opacity: name.trim() ? 1 : 0.4 }}
      >
        Create club
      </button>
    </div>
  );
}
