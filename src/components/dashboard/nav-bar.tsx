"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { colors as defaultColors } from "@/constants/colors";

type User = { name: string } | null;
type NavBarProps = {
  user?: User;
  colors?: typeof defaultColors;
};

export default function NavBar({
  user = null,
  colors = defaultColors,
}: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50"
      style={{ borderColor: colors.border.light }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: colors.gradients.brand }}
              aria-hidden="true"
            >
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: colors.gradients.brand }}
            >
              CoWork Central
            </span>
          </div>

          {/* Center: Desktop links */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Características
            </a>
            <a
              href="#spaces"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Espacios
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Precios
            </a>
          </div>

          {/* Right: Desktop auth + Mobile toggle */}
          <div className="ml-auto flex items-center">
            {/* Desktop auth */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">Hola, {user.name}</span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: colors.brand.primary[600] }}
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-sm sm:text-base text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-white px-4 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: colors.brand.primary[600] }}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>

            {/* Mobile chevron toggle on the far right */}
            <button
              type="button"
              className="md:hidden ml-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Abrir menú"
            >
              {menuOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden absolute left-0 right-0 mt-0 px-4 pb-4 border-t bg-white/95 backdrop-blur-md shadow-lg"
            style={{
              borderColor: colors.border.light,
              top: "64px", // altura del navbar (h-16)
            }}
          >
            <div className="pt-4 space-y-3">
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Características
              </a>
              <a
                href="#spaces"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Espacios
              </a>
              <a
                href="#pricing"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Precios
              </a>

              {user ? (
                <div className="pt-3 space-y-2">
                  <p className="text-sm" style={{ color: colors.neutral[600] }}>
                    Hola,{" "}
                    <span
                      className="font-medium"
                      style={{ color: colors.foreground.light }}
                    >
                      {user.name}
                    </span>
                  </p>
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex justify-center px-4 py-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: colors.brand.primary[600] }}
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="pt-3 space-y-2">
                  <Link
                    href="/auth/login"
                    className="block text-sm text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/register"
                    className="w-full inline-flex justify-center px-4 py-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: colors.brand.primary[600] }}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
