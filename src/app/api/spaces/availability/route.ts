import { prisma } from "@/constants/modules";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spaceIdParam = searchParams.get("spaceId");
    const date = searchParams.get("date");
    const startTimeParam = searchParams.get("startTime");
    const endTimeParam = searchParams.get("endTime");

    if (!date) {
      return NextResponse.json(
        { error: "Parameter date is required (format: YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json({ error: "Invalid Date" }, { status: 400 });
    }

    if (spaceIdParam) {
      const spaceId = parseInt(spaceIdParam);
      if (isNaN(spaceId)) {
        return NextResponse.json(
          { error: "spaceId must be a number" },
          { status: 400 }
        );
      }

      const space = await prisma.space.findUnique({
        where: { id: spaceId, isActive: true },
      });

      if (!space) {
        return NextResponse.json(
          { error: "Space not found or not active" },
          { status: 404 }
        );
      }

      if (startTimeParam && endTimeParam) {
        const startDateTime = new Date(`${date}T${startTimeParam}:00`);
        const endDateTime = new Date(`${date}T${endTimeParam}:00`);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          return NextResponse.json(
            { error: "Invalid time format. Use HH:MM" },
            { status: 400 }
          );
        }

        if (startDateTime >= endDateTime) {
          return NextResponse.json(
            { error: "Start time must be before end time" },
            { status: 400 }
          );
        }

        const conflictingBookings = await prisma.booking.findMany({
          where: {
            spaceId: spaceId,
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
            OR: [
              {
                startTime: {
                  gte: startDateTime,
                  lt: endDateTime,
                },
              },
              {
                endTime: {
                  gt: startDateTime,
                  lte: endDateTime,
                },
              },
              {
                startTime: {
                  lte: startDateTime,
                },
                endTime: {
                  gte: endDateTime,
                },
              },
            ],
          },
        });

        const isAvailable = conflictingBookings.length === 0;

        return NextResponse.json({
          success: true,
          available: isAvailable,
          space: {
            id: space.id,
            name: space.name,
            type: space.type,
            priceHour: parseFloat(space.priceHour.toString()),
          },
          requestedPeriod: {
            date,
            startTime: startTimeParam,
            endTime: endTimeParam,
          },
          conflictingBookings: isAvailable
            ? []
            : conflictingBookings.map((booking) => ({
                startTime: booking.startTime.toISOString(),
                endTime: booking.endTime.toISOString(),
              })),
        });
      }

      const dayStart = new Date(date + "T00:00:00");
      const dayEnd = new Date(date + "T23:59:59");

      const dayBookings = await prisma.booking.findMany({
        where: {
          spaceId: spaceId,
          status: {
            in: ["CONFIRMED", "PENDING"],
          },
          OR: [
            {
              startTime: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
            {
              endTime: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
          ],
        },
        select: {
          startTime: true,
          endTime: true,
          status: true,
        },
        orderBy: {
          startTime: "asc",
        },
      });

      return NextResponse.json({
        success: true,
        space: {
          id: space.id,
          name: space.name,
          type: space.type,
          priceHour: parseFloat(space.priceHour.toString()),
        },
        date,
        bookings: dayBookings.map((booking) => ({
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
          status: booking.status,
        })),
      });
    }

    const dayStart = new Date(date + "T00:00:00");
    const dayEnd = new Date(date + "T23:59:59");

    const spacesWithBookings = await prisma.space.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        type: true,
        capacity: true,
        priceHour: true,
        bookings: {
          where: {
            status: {
              in: ["CONFIRMED", "PENDING"],
            },
            OR: [
              {
                startTime: {
                  gte: dayStart,
                  lte: dayEnd,
                },
              },
              {
                endTime: {
                  gte: dayStart,
                  lte: dayEnd,
                },
              },
            ],
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
      },
      orderBy: {
        name: "asc",
      },
    });

    const availability = spacesWithBookings.map((space) => ({
      id: space.id,
      name: space.name,
      type: space.type,
      capacity: space.capacity,
      priceHour: parseFloat(space.priceHour.toString()),
      bookings: space.bookings.map((booking) => ({
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        status: booking.status,
      })),
      availableSlots:
        space.bookings.length === 0
          ? "All day available"
          : `${space.bookings.length} reservations`,
    }));

    return NextResponse.json({
      success: true,
      date,
      spaces: availability,
      total: availability.length,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
