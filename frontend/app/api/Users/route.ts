import { NextRequest, NextResponse } from "next/server";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";
import { RegisterFormData } from "@/app/ui/RegisterForm";

export async function POST(req: NextRequest) {
  try {
    const body: RegisterFormData = await req.json();
    console.log(body);

    //Confirm data exists
    if (!body || !body.email || !body.password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }
    console.log("Data exists");
    // check for duplicate emails
    const duplicate = await User.findOne({ email: body.email }).lean().exec();

    if (duplicate) {
      return NextResponse.json({ message: "Duplicate Email" }, { status: 409 });
    }

    const hashPassword = await bcrypt.hash(body.password, 13);
    body.password = hashPassword;
    console.log(body);
    await User.create(body);
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
