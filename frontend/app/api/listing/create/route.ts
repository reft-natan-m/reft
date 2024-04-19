import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, propertyId, tokens } = body;

  console.log("userID:", userId, "PropertyId:", propertyId, "Tokens:", tokens);
  try {
    const prismaUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { tokens: true },
    });

    if (!prismaUser) {
      return new NextResponse("User doesnt exist", { status: 400 });
    }

    console.log(prismaUser);

    const tokenToSplit = prismaUser.tokens.map((token) => {
      if (token.propertyId === propertyId && token.listed === (false || null)) {
        if (token) {
          return token;
        }
      }
    });

    const token = tokenToSplit.filter((value) => value !== undefined);

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

    await prisma.token.update({
      where: {
        id: token[0].id,
      },
      data: {
        numberOfTokens: token[0].numberOfTokens - tokens,
      },
    });

    await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        tokensforSale: { increment: tokens },
      },
    });

    return NextResponse.json(newToken);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create listing", { status: 500 });
  }
}
