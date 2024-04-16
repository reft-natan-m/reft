import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, ...propertyData } = body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        tokens: {
          create: {
            user: { connect: { id: userId } },
            numberOfTokens: propertyData.tokensMinted,
          },
        },
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create property", { status: 500 });
  }
}
