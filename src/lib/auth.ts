import { prisma } from "@/constants/modules";
import { NextRequest } from "next/server";
import { verifyToken } from "./verifyToken";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function validateAuth(
  request: NextRequest
): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return null;
    }

    const decoded = await verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export function requireAuth(
  handler: (request: NextRequest, user: AuthUser) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const user = await validateAuth(request);

    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return handler(request, user);
  };
}

export function requireAdmin(
  handler: (request: NextRequest, user: AuthUser) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const user = await validateAuth(request);

    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({
          error: "Acceso denegado - se requieren permisos de administrador",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return handler(request, user);
  };
}

export function requireAuthWithParams<T = any>(
  handler: (
    request: NextRequest,
    user: AuthUser,
    context: T
  ) => Promise<Response>
) {
  return async (request: NextRequest, context: T) => {
    const user = await validateAuth(request);

    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return handler(request, user, context);
  };
}

export function requireAdminWithParams<T = any>(
  handler: (
    request: NextRequest,
    user: AuthUser,
    context: T
  ) => Promise<Response>
) {
  return async (request: NextRequest, context: T) => {
    const user = await validateAuth(request);

    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({
          error: "Acceso denegado - se requieren permisos de administrador",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return handler(request, user, context);
  };
}
