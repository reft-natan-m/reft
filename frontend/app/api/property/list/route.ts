import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: { tokens: true },
    });

    if (!properties) {
      return new NextResponse("No properties", { status: 400 });
    }

    return NextResponse.json(properties);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch list of properties", {
      status: 500,
    });
  }
}
