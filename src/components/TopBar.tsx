import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-start justify-between px-5 pt-6 pb-4">
      <div>
        <h1 className="font-stencil text-[22px] uppercase tracking-wide text-text">{title}</h1>
        {subtitle && <span className="font-data text-xs text-text-faint">{subtitle}</span>}
      </div>
      <Sidebar className="mt-0.5 text-text-dim">
        <Menu size={20} />
      </Sidebar>
    </div>
  );
}
