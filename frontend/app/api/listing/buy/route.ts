import TokenizeStart from "@/app/ui/TokenizeStart";
import prisma from "@/lib/prisma";
import { Property, Token } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, propertyId } = body;
  let { tokens } = body;

  try {
    if (!userId || !propertyId) {
      return new NextResponse("Invalid userId or propertyId", { status: 404 });
    }

    if (!tokens || tokens <= 0) {
      return new NextResponse("Invalid number of tokens", { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
      include: { tokens: true },
    });

    if (!property) {
      return new NextResponse("Property not found ", { status: 404 });
    }

    if (!property.tokensforSale) {
      return new NextResponse("No tokens for sale", { status: 404 });
    }

    if (property.tokensforSale < tokens) {
      return new NextResponse("Not enought tokens for sale", { status: 404 });
    }

    let tokensToSell = tokens;
    let oldestToken: Token | undefined = property.tokens[0];

    while (tokens > 0) {
      oldestToken = await getOldestToken(propertyId);

      if (!oldestToken) {
        return new NextResponse("Can't find the oldest token", { status: 404 });
      }

      if (oldestToken.numberOfTokens >= tokens) {
        await prisma.token.update({
          where: { id: oldestToken.id },
          data: { numberOfTokens: oldestToken.numberOfTokens - tokens },
        });

        await prisma.token.create({
          data: {
            propertyId: oldestToken.propertyId,
            userId: userId,
            numberOfTokens: tokens,
            listed: false,
            dateListed: null,
          },
        });

        await prisma.property.update({
          where: { id: propertyId },
          data: {
            tokensforSale: property.tokensforSale - tokensToSell,
          },
        });

        const token = await combineOwnedTokens(userId, propertyId);

        return NextResponse.json(token);
      }

      await prisma.token.create({
        data: {
          propertyId: oldestToken.propertyId,
          userId: userId,
          numberOfTokens: oldestToken.numberOfTokens,
          listed: false,
          dateListed: null,
        },
      });

      await prisma.token.delete({
        where: { id: oldestToken.id },
      });

      tokens = tokens - oldestToken.numberOfTokens;
    }
  } catch (e) {
    return new NextResponse(`An error occured while buying property: ${e}`, {
      status: 500,
    });
  }
}

async function getOldestToken(propertyId: string): Promise<Token | undefined> {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { tokens: true },
  });

  const oldestToken = property?.tokens.reduce(
    (oldest: Token, current: Token) => {
      if (
        !oldest.dateListed ||
        (current.dateListed && current.dateListed < oldest.dateListed)
      ) {
        return current;
      }
      return oldest;
    },
    {} as Token
  );

  return oldestToken;
}

async function combineOwnedTokens(
  userId: string,
  propertyId: string
): Promise<Token> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { tokens: true },
  });

  const propertyTokens = await prisma.token.findMany({
    where: { propertyId: propertyId, userId: userId, listed: false },
  });

  if (propertyTokens.length === 1) {
    return propertyTokens[0];
  }

  let totalNumberOfTokens = 0;

  propertyTokens.forEach(async (token) => {
    totalNumberOfTokens += token.numberOfTokens;

    await prisma.token.delete({
      where: { id: token.id },
    });
  });

  const combinedToken = await prisma.token.create({
    data: {
      propertyId: propertyId,
      userId: userId,
      numberOfTokens: totalNumberOfTokens,
      listed: false,
      dateListed: null,
    },
  });

  return combinedToken;
}
