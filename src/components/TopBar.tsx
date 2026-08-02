export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-5 pt-6 pb-4">
      <h1 className="font-stencil text-[22px] uppercase tracking-wide text-text">{title}</h1>
      {subtitle && <span className="font-data text-xs text-text-faint">{subtitle}</span>}
    </div>
  );
}
