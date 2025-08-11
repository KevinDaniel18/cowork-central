"use client";

import { RegisterForm } from "@/components/auth/register-form";
import { colors } from "@/constants/colors";

export default function RegisterPage() {
  return (
    <div
      className="min-h-[100svh] grid place-items-center px-4"
      style={{
        backgroundColor: colors.background.light,
        backgroundImage: colors.gradients.hero,
      }}
    >
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div
            className="inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium"
            style={{
              background: colors.gradients.brand,
              color: "#ffffff",
            }}
          >
            Coworking Reservas
          </div>
          <h1
            className="mt-3 text-2xl font-semibold"
            style={{ color: colors.foreground.light }}
          >
            Únete a la plataforma
          </h1>
          <p className="text-sm" style={{ color: colors.neutral[500] }}>
            Regístrate para empezar a reservar espacios
          </p>
        </div>

        <RegisterForm />

        <p
          className="mt-6 text-center text-xs"
          style={{ color: colors.neutral[500] }}
        >
          Al registrarte aceptas nuestros Términos y Política de Privacidad
        </p>
      </div>
    </div>
  );
}
