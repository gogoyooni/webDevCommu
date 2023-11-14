import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const { title, content } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에
  const session: any = await getServerSession(authOptions);

  if (!session.user) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User is not found" }, { status: 403 });
  }

  const createdPost = await prisma.post.create({
    data: {
      title,
      content,

      authorId: user?.id as string,
    },
  });

  return NextResponse.json({ createdPost }, { status: 200 });
}
