import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NotificationType } from "@prisma/client";

// @ comment - user likes comment
export async function POST(req: NextRequest) {
  const { userId, commentId, postId, postAuthorId } = await req.json();

  if (!userId || !commentId || !postId || !postAuthorId) {
    return NextResponse.json({ message: "Your request is invalid" }, { status: 400 });
  }

  const session: any = await getServerSession(authOptions);
  if (!session.user) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }
  let result;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User is not found" }, { status: 403 });
    }

    // 유저가 코멘트를 like 할때
    result = await prisma.like.create({
      data: {
        userId: user.id,
        commentId: commentId,
      },
    });

    const notification = await prisma.notification.create({
      data: {
        senderUserId: user.id,
        notificationType: NotificationType.LIKE_COMMENT,
        commentId,
        recipientUserId: postAuthorId,
        postId,
      },
    });

    return NextResponse.json({ message: "SUCCESS", response: notification }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
  }

  // return NextResponse.json({ result }, { status: 200 });
}

// @ comment - user unlikes comment
export async function DELETE(req: NextRequest) {
  const { likeId, userId, commentId } = await req.json();

  console.log("likeId", likeId);

  if (!likeId || !commentId) {
    return NextResponse.json({ message: "Your request is invalid" }, { status: 400 });
  }

  const session: any = await getServerSession(authOptions);
  if (!session.user) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }
  let result;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User is not found" }, { status: 403 });
    }

    // 유저가 코멘트를 unllike 할때
    result = await prisma.like.delete({
      where: {
        id: likeId,
        userId: user.id,
        commentId: commentId,
      },
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
  }

  //   return NextResponse.json({ result }, { status: 200 });
}
