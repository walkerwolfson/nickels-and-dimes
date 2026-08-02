import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col justify-center px-6" style={{ background: "var(--bg)" }}>
      <div className="mb-10 flex flex-col items-center gap-1 text-center">
        <Image src="/brand/logo-lockup.png" alt="Nickels & Dimes" width={216} height={147} priority className="w-[135px]" />
        <span className="font-data text-xs text-text-faint">Log it. Compare it. Beat it.</span>
      </div>
      <LoginForm />
    </div>
  );
}
