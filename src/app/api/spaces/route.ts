import { Prisma, prisma } from "@/constants/modules";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const activeParam = searchParams.get("active");
    const minCapacity = searchParams.get("minCapacity");
    const q = searchParams.get("q")?.trim();

    const where: Prisma.SpaceWhereInput = {};

    if (activeParam !== null) {
      where.isActive = activeParam === "true";
    }

    if (type) {
      where.type = type as "DESK" | "OFFICE" | "MEETING_ROOM" | "PHONE_BOOTH";
    }

    if (minCapacity) {
      where.capacity = { gte: parseInt(minCapacity, 10) };
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const spaces = await prisma.space.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        capacity: true,
        priceHour: true,
        amenities: true,
        imageUrl: true,
        description: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            bookings: {
              where: { status: "COMPLETED" },
            },
          },
        },
      },
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    });

    const spacesWithStats = spaces.map((space) => ({
      ...space,
      totalBookings: space._count.bookings,
      priceHour: parseFloat(space.priceHour.toString()),
      _count: undefined,
    }));

    return NextResponse.json({
      success: true,
      spaces: spacesWithStats,
      total: spacesWithStats.length,
    });
  } catch (error) {
    console.error("Error fetching spaces", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const POST = requireAdmin(async (request: NextRequest, user) => {
  try {
    const {
      name,
      type,
      capacity,
      priceHour,
      amenities,
      imageUrl,
      description,
    } = await request.json();

    if (!name || !type || !capacity || !priceHour) {
      return new Response(
        JSON.stringify({
          error: "Required fields: name, type, capacity, priceHour",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validTypes = ["DESK", "OFFICE", "MEETING_ROOM", "PHONE_BOOTH"];
    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({
          error: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (capacity < 1 || priceHour <= 0) {
      return new Response(
        JSON.stringify({ error: "Capacity must be >= 1 and price > 0" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const space = await prisma.space.create({
      data: {
        name,
        type,
        capacity: parseInt(capacity),
        priceHour: parseFloat(priceHour),
        amenities: amenities || [],
        imageUrl: imageUrl || null,
        description: description || null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
        capacity: true,
        priceHour: true,
        amenities: true,
        imageUrl: true,
        description: true,
        isActive: true,
        createdAt: true,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        space: {
          ...space,
          priceHour: parseFloat(space.priceHour.toString()),
        },
        message: "Espacio creado exitosamente",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating space:", error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
});
