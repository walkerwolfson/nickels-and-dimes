"use client";

import { useState, useTransition } from "react";
import { updatePreferences } from "@/lib/actions/profile";
import { signOut } from "@/lib/actions/auth";
import type { Units, FontSize } from "@prisma/client";

const UNIT_OPTIONS: Units[] = ["LB", "KG"];
const FONT_OPTIONS: { value: FontSize; label: string }[] = [
  { value: "SMALL", label: "Small" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LARGE", label: "Large" },
];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-[20px] border px-4 py-2 font-data text-xs font-semibold"
      style={{
        background: active ? "var(--purple)" : "var(--surface)",
        color: active ? "#fff" : "var(--text-dim)",
        borderColor: active ? "var(--purple)" : "var(--border)",
      }}
    >
      {children}
    </button>
  );
}

export function SettingsForm({
  units: initialUnits,
  fontSize: initialFontSize,
  marketingOptIn: initialMarketingOptIn,
}: {
  units: Units;
  fontSize: FontSize;
  marketingOptIn: boolean;
}) {
  const [units, setUnits] = useState(initialUnits);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [marketingOptIn, setMarketingOptIn] = useState(initialMarketingOptIn);
  const [, startTransition] = useTransition();

  function save(nextUnits: Units, nextFontSize: FontSize, nextMarketingOptIn: boolean) {
    const fd = new FormData();
    fd.set("units", nextUnits);
    fd.set("fontSize", nextFontSize);
    fd.set("marketingOptIn", String(nextMarketingOptIn));
    startTransition(() => {
      updatePreferences(fd);
    });
  }

  return (
    <div className="flex flex-col gap-8 px-5">
      <section className="flex flex-col gap-2">
        <span className="font-data text-xs tracking-wide text-text-dim">UNITS</span>
        <div className="flex gap-2">
          {UNIT_OPTIONS.map((u) => (
            <Pill
              key={u}
              active={units === u}
              onClick={() => {
                setUnits(u);
                save(u, fontSize, marketingOptIn);
              }}
            >
              {u}
            </Pill>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <span className="font-data text-xs tracking-wide text-text-dim">FONT SIZE</span>
        <div className="flex gap-2">
          {FONT_OPTIONS.map((f) => (
            <Pill
              key={f.value}
              active={fontSize === f.value}
              onClick={() => {
                setFontSize(f.value);
                save(units, f.value, marketingOptIn);
              }}
            >
              {f.label}
            </Pill>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <span className="font-data text-xs tracking-wide text-text-dim">EMAIL PREFERENCES</span>
        <label className="flex items-center justify-between rounded-[12px] border border-border bg-surface px-4 py-3.5">
          <div className="flex flex-col pr-3">
            <span className="text-[13.5px] font-semibold text-text">Promotional emails</span>
            <span className="mt-0.5 text-[11.5px] leading-snug text-text-faint">
              New features, club challenges, and product updates.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !marketingOptIn;
              setMarketingOptIn(next);
              save(units, fontSize, next);
            }}
            className="relative flex-shrink-0"
            style={{
              width: 44,
              height: 26,
              borderRadius: 999,
              background: marketingOptIn ? "var(--purple)" : "var(--border)",
              transition: "background 0.15s",
            }}
          >
            <span
              className="absolute top-0.5 rounded-full bg-white transition-all"
              style={{ width: 22, height: 22, left: marketingOptIn ? 20 : 2 }}
            />
          </button>
        </label>
      </section>

      <form action={signOut} className="mt-4">
        <button
          type="submit"
          className="w-full py-3.5 font-display text-[15px] uppercase text-text-dim"
          style={{ background: "var(--surface)", borderRadius: 12, border: "1.5px solid var(--border)" }}
        >
          Log out
        </button>
      </form>
    </div>
  );
}
