// colors.ts
// Paleta accesible, moderna, sin azules. Incluye tokens semánticos para UI, estados,
// calendario, pagos y charts. Diseñada para funcionar bien en light/dark.
export const colors = {
  // Identidad de marca (emerald/teal + acentos cálidos)
  brand: {
    primary: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
    },
    secondary: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
    accent: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#f59e0b",
      500: "#d97706",
      600: "#b45309",
      700: "#92400e",
      800: "#78350f",
      900: "#451a03",
    },
  },

  // Neutros para superficies y tipografía
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#0a0a0a",
  },

  // Tokens de tema
  background: { light: "#ffffff", dark: "#0a0a0a" },
  foreground: { light: "#0a0a0a", dark: "#fafafa" },
  surface: { light: "#ffffff", dark: "#0f0f10" },
  muted: { light: "#f6f6f7", dark: "#151516" },
  border: { light: "#e5e7eb", dark: "#2a2b2e" },
  ring: { light: "#10b981", dark: "#34d399" },

  // Estados (semánticos)
  state: {
    success: {
      bg: "#ecfdf5",
      fg: "#065f46",
      ring: "#10b981",
      solid: "#10b981",
    },
    warning: {
      bg: "#fffbeb",
      fg: "#78350f",
      ring: "#f59e0b",
      solid: "#f59e0b",
    },
    danger: {
      bg: "#fee2e2",
      fg: "#7f1d1d",
      ring: "#ef4444",
      solid: "#ef4444",
    },
    info: {
      // Usamos teal/cyan en vez de azul
      bg: "#ecfeff",
      fg: "#115e59",
      ring: "#14b8a6",
      solid: "#14b8a6",
    },
  },

  // Calendario y flujo de reservas
  booking: {
    slot: {
      availableBg: "#ffffff",
      availableBorder: "#d4d4d8",
      selectedBg: "#10b981",
      selectedText: "#ffffff",
      reservedBg: "#f4f4f5",
      reservedText: "#71717a",
      blockedBg: "#fee2e2",
      blockedText: "#7f1d1d",
      hoverBg: "#ecfdf5",
      todayRing: "#34d399",
    },
    legend: {
      available: "#10b981",
      reserved: "#a1a1aa",
      blocked: "#ef4444",
      selected: "#14b8a6",
    },
  },

  // Pagos y notificaciones
  payments: {
    brand: "#14b8a6",
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    pending: "#a1a1aa",
  },
  notifications: {
    unreadDot: "#10b981",
    successBg: "#ecfdf5",
    warningBg: "#fffbeb",
    errorBg: "#fee2e2",
  },

  // Paletas para charts (color‑blind friendly, sin azules)
  charts: {
    categorical: [
      "#10b981", // emerald
      "#f59e0b", // amber
      "#ef4444", // red
      "#14b8a6", // teal
      "#a78bfa", // violet (suave, poco uso)
      "#f97316", // orange
      "#22c55e", // green
      "#eab308", // yellow
    ],
    sequential: [
      "#ecfdf5",
      "#d1fae5",
      "#a7f3d0",
      "#6ee7b7",
      "#34d399",
      "#10b981",
      "#059669",
      "#047857",
    ],
    diverging: ["#ef4444", "#f59e0b", "#10b981"],
  },

  // Preferencias por sección/ruta
  pages: {
    auth: { primary: "#14b8a6", accent: "#f59e0b" },
    dashboard: { primary: "#10b981", accent: "#f59e0b" },
    admin: { primary: "#14b8a6", warning: "#f59e0b", danger: "#ef4444" },
    booking: { primary: "#10b981", accent: "#14b8a6" },
    spaces: { primary: "#14b8a6", accent: "#f59e0b" },
  },

  // Gradientes útiles para hero/headers
  gradients: {
    brand: "linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #f59e0b 100%)",
    hero:
      "radial-gradient(1200px 600px at 20% 10%, #10b9811a 0%, transparent 60%), " +
      "radial-gradient(800px 400px at 90% 30%, #f59e0b1a 0%, transparent 70%)",
  },
} as const;
