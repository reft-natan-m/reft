import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city");

  try {
    let properties = null;
    if (!city) {
      properties = await prisma.property.findMany({
        include: { tokens: true },
        where: { tokensforSale: { gt: 0 } },
      });

      if (!properties) {
        return new NextResponse("No properties", { status: 400 });
      }
    } else {
      properties = await prisma.property.findMany({
        include: { tokens: true },
        where: {
          tokensforSale: { gt: 0 },
          city: { startsWith: city.toLowerCase() },
        },
      });
    }

    return NextResponse.json(properties);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch list of properties", {
      status: 500,
    });
  }
}
