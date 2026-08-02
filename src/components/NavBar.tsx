"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Plus, Trophy, Dumbbell } from "lucide-react";

const ITEMS = [
  { id: "home", href: "/home", icon: Home, label: "Home" },
  { id: "club", href: "/club", icon: Users, label: "Club" },
  { id: "log", href: "/log", icon: Plus, label: "Log", isCta: true },
  { id: "prs", href: "/prs", icon: Trophy, label: "PRs" },
  { id: "history", href: "/history", icon: Dumbbell, label: "History" },
] as const;

export function NavBar() {
  const pathname = usePathname();

  return (
    <div className="flex h-[72px] flex-shrink-0 items-center justify-between border-t-2 border-border bg-surface px-4">
      {ITEMS.map((item) => {
        const active = pathname?.startsWith(item.href);
        if (item.id === "log") {
          return (
            <Link
              key={item.id}
              href={item.href}
              className="-mt-5 flex flex-col items-center justify-center rounded-[14px] border-2 border-[#2B2E00] bg-yellow shadow-[0_4px_10px_rgba(232,255,61,0.55)]"
              style={{ width: 52, height: 52 }}
            >
              <Plus size={24} color="#2B2E00" />
            </Link>
          );
        }
        return (
          <Link
            key={item.id}
            href={item.href}
            className="flex flex-col items-center gap-1"
            style={{ width: 52, color: active ? "var(--purple-deep)" : "var(--text-faint)" }}
          >
            <item.icon size={20} strokeWidth={active ? 2.4 : 1.8} />
            <span
              className="font-data text-[10px] tracking-wide"
              style={{ fontWeight: active ? 700 : 400 }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
