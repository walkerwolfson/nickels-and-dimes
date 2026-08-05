import Image from "next/image";
import { LoginForm } from "@/components/auth/LoginForm";
import { LandingCarousel } from "@/components/auth/LandingCarousel";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col px-0 pb-10" style={{ background: "var(--bg)" }}>
      <div className="flex flex-col items-center gap-1 px-6 pb-6 pt-10 text-center">
        <Image src="/brand/logo-lockup.png" alt="Nickels & Dimes" width={216} height={147} priority className="w-[110px]" />
        <span className="font-data text-xs text-text-faint">Log it. Compare it. Beat it.</span>
      </div>

      <LandingCarousel />

      <div className="mt-8 px-6">
        <LoginForm />
      </div>
    </div>
  );
}
