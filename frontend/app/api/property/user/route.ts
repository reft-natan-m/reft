import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Property } from "@prisma/client";

export async function GET(request: NextRequest) {
  const userEmail = request.nextUrl.searchParams.get("email");
  const properties: Property[] = [];

  if (!userEmail) {
    return new NextResponse("No user email provided", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      include: { tokens: true },
    });

    if (!user) {
      return new NextResponse("No user found", {
        status: 404,
      });
    }

    await Promise.all(
      user.tokens.map(async (tokenId) => {
        const property = await prisma.property.findUnique({
          where: {
            id: tokenId.propertyId,
          },
        });

        if (!property) {
          return new NextResponse("No properties found", {
            status: 204,
          });
        }
        properties.push(property);
      })
    );

    return NextResponse.json(properties);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch user properties", { status: 500 });
  }
}
