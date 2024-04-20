import prisma from "@/lib/prisma";
import { Token } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, propertyId, tokens } = body;

  try {
    const prismaUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { tokens: true },
    });

    if (!prismaUser) {
      return new NextResponse("User doesnt exist", { status: 400 });
    }

    const tokenToList = prismaUser.tokens.filter((token) => {
      return (
        token.propertyId === propertyId &&
        (token.listed === false || token.listed === null)
      );
    });

    const token = tokenToList.filter((value) => value !== undefined);

    if (!token[0]) {
      return new NextResponse(
        "User doesnt own or have enough tokens for this property",
        {
          status: 400,
        }
      );
    }

    if (token[0].numberOfTokens < tokens) {
      return new NextResponse("User doesnt own enough tokens", { status: 400 });
    }

    const newToken = await prisma.token.create({
      data: {
        user: { connect: { id: userId } },
        property: { connect: { id: propertyId } },
        numberOfTokens: tokens,
        listed: true,
        dateListed: new Date(),
      },
    });

    if (token[0].numberOfTokens === tokens) {
      await prisma.token.delete({
        where: { id: token[0].id },
      });
    } else {
      await prisma.token.update({
        where: {
          id: token[0].id,
        },
        data: {
          numberOfTokens: token[0].numberOfTokens - tokens,
        },
      });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        tokensforSale: property?.tokensforSale + tokens,
      },
    });

    return NextResponse.json(newToken);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create listing", { status: 500 });
  }
}
