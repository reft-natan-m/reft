import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { avatar, username, email, password } = body; // avatar, activated, role
  console.log(body);

  if (!username || !email || !password) {
    return new NextResponse(
      JSON.stringify({ error: "Missing name, email, or password" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const exist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (exist) {
    return new NextResponse(JSON.stringify({ error: "User already exists" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      avatar,
      username,
      email,
      hashedPassword,
    },
  });

  return NextResponse.json(user);
}
