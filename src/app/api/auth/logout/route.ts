import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const res = NextResponse.json({
      success: true,
      message: "Logout exitoso",
    });

    res.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
