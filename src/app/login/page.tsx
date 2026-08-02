import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="mb-10 flex flex-col items-center gap-1 text-center">
        <span className="font-stencil text-[26px] uppercase tracking-wide text-text">Nickels &amp; Dimes</span>
        <span className="font-data text-xs text-text-faint">Log it. Compare it. Beat it.</span>
      </div>
      <LoginForm />
    </div>
  );
}
