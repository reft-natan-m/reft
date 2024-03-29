import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, email, password } = body; // avatar, activated, role
  console.log(body);

  if (!username || !email || !password) {
    return new NextResponse("Missing name, email, or password", {
      status: 400,
    });
  }

  const exist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (exist) {
    return new NextResponse("User already exists", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
