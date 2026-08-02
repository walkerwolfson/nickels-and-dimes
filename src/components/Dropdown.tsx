"use client";

import { ChevronDown } from "lucide-react";

export function Dropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative flex items-center rounded-[10px] border-[1.5px] border-border bg-surface">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent px-3.5 py-2.5 pr-7 font-data text-[13px] font-semibold text-text outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-2.5 text-text-dim" />
    </div>
  );
}
