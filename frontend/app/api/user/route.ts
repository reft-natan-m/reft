import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");

  if (!email) {
    return new NextResponse("Missing email", {
      status: 400,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: { tokens: true },
  });

  if (!user) {
    return new NextResponse("No user found", {
      status: 404,
    });
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    avatar: user.avatar,
    tokens: user.tokens,
  });
}
