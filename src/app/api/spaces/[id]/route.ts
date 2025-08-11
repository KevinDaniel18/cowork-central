import { prisma } from "@/constants/modules";
import { requireAdminWithParams } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaceId = parseInt(params.id);

    if (isNaN(spaceId)) {
      return NextResponse.json(
        { error: "ID de espacio inválido" },
        { status: 400 }
      );
    }

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
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
        updatedAt: true,
        bookings: {
          where: {
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
            startTime: {
              gte: new Date(),
            },
          },
          select: {
            startTime: true,
            endTime: true,
            status: true,
          },
          orderBy: {
            startTime: "asc",
          },
        },

        _count: {
          select: {
            bookings: {
              where: {
                status: "COMPLETED",
              },
            },
          },
        },
      },
    });

    if (!space) {
      return NextResponse.json(
        { error: "Espacio no encontrado" },
        { status: 404 }
      );
    }

    const formattedSpace = {
      ...space,
      priceHour: parseFloat(space.priceHour.toString()),
      totalBookings: space._count.bookings,
      upcomingBookings: space.bookings.length,
      _count: undefined,
      bookings: undefined,
    };

    return NextResponse.json({
      success: true,
      space: formattedSpace,
    });
  } catch (error) {
    console.error("Error fetching space:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const PUT = requireAdminWithParams(
  async (
    request: NextRequest,
    user,
    { params }: { params: { id: string } }
  ) => {
    try {
      const spaceId = parseInt(params.id);

      if (isNaN(spaceId)) {
        return new Response(
          JSON.stringify({ error: "ID de espacio inválido" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const {
        name,
        type,
        capacity,
        priceHour,
        amenities,
        imageUrl,
        description,
        isActive,
      } = await request.json();

      const existingSpace = await prisma.space.findUnique({
        where: { id: spaceId },
      });

      if (!existingSpace) {
        return new Response(
          JSON.stringify({ error: "Espacio no encontrado" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (type) {
        const validTypes = ["DESK", "OFFICE", "MEETING_ROOM", "PHONE_BOOTH"];
        if (!validTypes.includes(type)) {
          return new Response(
            JSON.stringify({
              error: `Tipo inválido. Debe ser uno de: ${validTypes.join(", ")}`,
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }

      if (capacity !== undefined && capacity < 1) {
        return new Response(
          JSON.stringify({ error: "Capacidad debe ser >= 1" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (priceHour !== undefined && priceHour <= 0) {
        return new Response(JSON.stringify({ error: "Precio debe ser > 0" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (type !== undefined) updateData.type = type;
      if (capacity !== undefined) updateData.capacity = parseInt(capacity);
      if (priceHour !== undefined) updateData.priceHour = parseFloat(priceHour);
      if (amenities !== undefined) updateData.amenities = amenities;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (description !== undefined) updateData.description = description;
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);

      const updatedSpace = await prisma.space.update({
        where: { id: spaceId },
        data: updateData,
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
          updatedAt: true,
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          space: {
            ...updatedSpace,
            priceHour: parseFloat(updatedSpace.priceHour.toString()),
          },
          message: "Espacio actualizado exitosamente",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error updating space:", error);
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
  }
);

export const DELETE = requireAdminWithParams(
  async (
    request: NextRequest,
    user,
    { params }: { params: { id: string } }
  ) => {
    try {
      const spaceId = parseInt(params.id);

      if (isNaN(spaceId)) {
        return new Response(
          JSON.stringify({ error: "ID de espacio inválido" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const existingSpace = await prisma.space.findUnique({
        where: { id: spaceId },
        include: {
          _count: {
            select: {
              bookings: {
                where: {
                  status: {
                    in: ["CONFIRMED", "PENDING"],
                  },
                  startTime: {
                    gte: new Date(),
                  },
                },
              },
            },
          },
        },
      });

      if (!existingSpace) {
        return new Response(
          JSON.stringify({ error: "Espacio no encontrado" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (existingSpace._count.bookings > 0) {
        return new Response(
          JSON.stringify({
            error:
              "No se puede eliminar el espacio porque tiene reservas activas o futuras. Desactívalo en su lugar.",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      await prisma.space.delete({
        where: { id: spaceId },
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Espacio eliminado exitosamente",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error deleting space:", error);
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
  }
);
