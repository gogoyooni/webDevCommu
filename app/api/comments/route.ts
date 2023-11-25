import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session: any = await getServerSession(authOptions);

  if (!session.user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const data = await prisma.comment.findMany({
    include: {
      author: true,
      replies: {
        select: {
          content: true,
          // createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              // userLikeComments: true,
            },
          },
        },
      },
    },
  });

  console.log("api route data:", data);

  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { motherCommentId, content, postId } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에
  // const { content } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에
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

  if (motherCommentId) {
    const data = await prisma.comment.create({
      data: {
        postId, //
        authorId: user.id,
        content,
        motherCommentId,
      },
    });
    return NextResponse.json({ data }, { status: 200 });
  } else {
    const data = await prisma.comment.create({
      data: {
        postId, //
        authorId: user.id,
        content,
        motherComment: undefined,
      },
    });

    return NextResponse.json({ data }, { status: 200 });
  }
}

export async function PATCH(req: NextRequest) {
  const { motherCommentId, content, postId } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에
  // const { content } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에

  console.log("data:::", motherCommentId, content, postId);

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

  if (motherCommentId) {
    const data = await prisma.comment.create({
      data: {
        postId, //
        authorId: user.id,
        content,
        motherCommentId,
      },
    });
    return NextResponse.json({ data }, { status: 200 });
  }
}
