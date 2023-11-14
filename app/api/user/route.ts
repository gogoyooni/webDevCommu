import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { User } from "@prisma/client";

export async function POST(req: NextRequest) {
  const { name, email, image }: User = await req.json();

  if (!name || !email) {
    return NextResponse.json({ message: "Username or email should be included" }, { status: 403 });
  }

  await prisma.user.create({
    data: {
      name,
      email,
      image,
      //   profileImage:
    },
  });
  return NextResponse.json({ message: "User Created" }, { status: 201 });
}
