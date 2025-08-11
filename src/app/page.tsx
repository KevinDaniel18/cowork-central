"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { colors } from "@/constants/colors";
import NavBar from "@/components/dashboard/nav-bar";

interface UserProps {
  name: string;
}

export default function LandingPage() {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: (
        <Calendar
          className="w-8 h-8"
          style={{ color: colors.brand.primary[600] }}
        />
      ),
      title: "Reservas en Tiempo Real",
      description:
        "Ve la disponibilidad actualizada al instante y reserva con un clic",
    },
    {
      icon: (
        <Shield
          className="w-8 h-8"
          style={{ color: colors.brand.secondary[600] }}
        />
      ),
      title: "Pagos Seguros",
      description:
        "Procesa pagos de forma segura con encriptación de nivel bancario",
    },
    {
      icon: (
        <BarChart3
          className="w-8 h-8"
          style={{ color: colors.brand.accent[500] }}
        />
      ),
      title: "Analytics Avanzados",
      description:
        "Dashboard completo con métricas y reportes para administradores",
    },
    {
      icon: (
        <MapPin
          className="w-8 h-8"
          style={{ color: colors.brand.secondary[600] }}
        />
      ),
      title: "Múltiples Ubicaciones",
      description:
        "Gestiona espacios en diferentes ubicaciones desde un solo panel",
    },
  ];

  const spaceTypes = [
    { name: "Escritorios", price: "Desde $15/hora", popular: false },
    { name: "Oficinas Privadas", price: "Desde $45/hora", popular: true },
    { name: "Salas de Reuniones", price: "Desde $30/hora", popular: false },
    { name: "Phone Booths", price: "Desde $8/hora", popular: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2"
          style={{
            borderColor: "#e5e7eb",
            borderBottomColor: colors.brand.primary[600],
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background.light,
        backgroundImage: colors.gradients.hero,
      }}
    >
      <NavBar user={user} colors={colors} />

      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: colors.gradients.hero }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              style={{ color: colors.foreground.light }}
            >
              Reserva tu espacio de{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: colors.gradients.brand }}
              >
                trabajo perfecto
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 leading-relaxed"
              style={{ color: colors.neutral[600] }}
            >
              Encuentra y reserva escritorios, oficinas y salas de reuniones en
              tiempo real. La plataforma más moderna para espacios de coworking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/spaces"
                className="px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center"
                style={{
                  backgroundColor: colors.brand.primary[600],
                  color: "#ffffff",
                }}
              >
                Ver Espacios Disponibles
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              {!user && (
                <a
                  href="/auth/register"
                  className="border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
                  style={{
                    borderColor: colors.border.light,
                    color: colors.foreground.light,
                  }}
                >
                  Empezar Gratis
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.foreground.light }}
            >
              ¿Por qué elegir CoWork Central?
            </h2>
            <p className="text-xl" style={{ color: colors.neutral[600] }}>
              Una plataforma completa diseñada para hacer que la reserva de
              espacios sea simple y eficiente.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.foreground.light }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: colors.neutral[600] }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="spaces"
        className="py-20"
        style={{
          backgroundImage:
            "linear-gradient(135deg, " +
            colors.neutral[50] +
            " 0%, " +
            colors.brand.secondary[50] +
            " 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.foreground.light }}
            >
              Espacios para cada necesidad
            </h2>
            <p className="text-xl" style={{ color: colors.neutral[600] }}>
              Desde escritorios individuales hasta salas de juntas completas
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spaceTypes.map((space, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                {space.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span
                      className="text-white px-4 py-1 rounded-full text-sm font-semibold"
                      style={{ background: colors.gradients.brand }}
                    >
                      Más Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: colors.foreground.light }}
                  >
                    {space.name}
                  </h3>
                  <p
                    className="text-2xl font-bold bg-clip-text text-transparent mb-4"
                    style={{ backgroundImage: colors.gradients.brand }}
                  >
                    {space.price}
                  </p>
                  <div
                    className="space-y-2 text-sm"
                    style={{ color: colors.neutral[600] }}
                  >
                    <div className="flex items-center justify-center">
                      <CheckCircle
                        className="w-4 h-4 mr-2"
                        style={{ color: colors.brand.primary[500] }}
                      />
                      WiFi incluido
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle
                        className="w-4 h-4 mr-2"
                        style={{ color: colors.brand.primary[500] }}
                      />
                      Cancelación flexible
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle
                        className="w-4 h-4 mr-2"
                        style={{ color: colors.brand.primary[500] }}
                      />
                      Acceso 24/7
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: colors.brand.primary[600] }}
              >
                500+
              </div>
              <div
                className="font-semibold"
                style={{ color: colors.neutral[600] }}
              >
                Espacios disponibles
              </div>
            </div>
            <div>
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: colors.brand.secondary[600] }}
              >
                10k+
              </div>
              <div
                className="font-semibold"
                style={{ color: colors.neutral[600] }}
              >
                Reservas completadas
              </div>
            </div>
            <div>
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: colors.brand.accent[600] }}
              >
                98%
              </div>
              <div
                className="font-semibold"
                style={{ color: colors.neutral[600] }}
              >
                Satisfacción de clientes
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20"
        style={{
          background: colors.gradients.brand,
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para encontrar tu espacio ideal?
          </h2>
          <p className="text-xl mb-8" style={{ color: "#e6fffa" }}>
            Únete a miles de profesionales que ya confían en CoWork Central para
            sus necesidades de workspace.
          </p>
          <a
            href={user ? "/dashboard" : "/auth/register"}
            className="px-8 py-4 rounded-lg text-lg font-semibold inline-flex items-center transition-colors"
            style={{
              backgroundColor: "#ffffff",
              color: colors.brand.primary[600],
            }}
          >
            {user ? "Ir al Dashboard" : "Comenzar Ahora"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      <footer
        className="py-12"
        style={{ backgroundColor: colors.neutral[900], color: "#fff" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: colors.gradients.brand }}
              >
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CoWork Central</span>
            </div>
            <div className="text-gray-300 text-center">
              © 2025 CoWork Central. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
