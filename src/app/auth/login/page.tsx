"use client";

import { LoginForm } from "@/components/auth/login-form";
import { colors } from "@/constants/colors";

export default function LoginPage() {
  return (
    <div
      className=" min-h-[100svh] grid place-items-center px-4"
      style={{
        backgroundColor: colors.background.light,
        backgroundImage: colors.gradients.hero,
      }}
    >
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div
            className="inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium"
            style={{ background: colors.gradients.brand, color: "#ffffff" }}
          >
            Coworking Reservations
          </div>
          <h1
            className="mt-3 text-2xl font-medium"
            style={{ color: colors.foreground.light }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: colors.neutral[500] }}>
            Enter your credentials to continue
          </p>
        </div>

        <LoginForm />

        <p
          className="mt-6 text-center text-xs"
          style={{ color: colors.neutral[500] }}
        >
          By continuing you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}
