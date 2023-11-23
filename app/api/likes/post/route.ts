import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NotificationType } from "@prisma/client";

export async function POST(req: NextRequest) {
  //   const postId = params.postId;
  const { postId, toWhomId } = await req.json();
  const session: any = await getServerSession(authOptions);
  if (!session.user) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  if (!postId) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
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

    // const notification = await prisma.postNotification.create({
    //   data: {
    //     type: NotificationType.LIKEPOST,
    //     toWhomId,
    //     userLikedPostId: ""
    //     // doerId: user.id, // 이 유저가 좋아요를 한거다. (그냥 userId로 되어있어서 헷갈린다)
    //     // doerName: user.name,
    //     // relatedPostId: postId,
    //   },
    // });

    // 유저가 포스트를 like 할때
    result = await prisma.like.create({
      data: {
        userId: user.id, // 포스트를 좋아요한 사람
        postId,
        // notificationId: notification.id,
      },
    });

    const notification = await prisma.notification.create({
      data: {
        senderUserId: user.id,
        notificationType: NotificationType.LIKE_POST,
        recipientUserId: toWhomId,
        postId,
        // userLikedPostId: result.id,
        // doerId: user.id, // 이 유저가 좋아요를 한거다. (그냥 userId로 되어있어서 헷갈린다)
        // doerName: user.name,
        // relatedPostId: postId,
      },
    });

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  //   const postId = params.postId;
  const { userId, postId, commentId } = await req.json();
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

  const foundUserLikePost = await prisma.like.findFirst({
    where: {
      userId: user.id,
      postId,
    },
  });

  const postToDelete = await prisma.like.findFirst({
    where: {
      userId: user.id,
      postId,
    },
  });

  if (!postToDelete) {
    return NextResponse.json({ message: "Post to delete is not found" }, { status: 404 });
  }

  // 유저가 포스트를 unlike 할때
  const deletedLike = await prisma.like.delete({
    where: {
      id: postToDelete?.id,
      // notificationId: "",
      userId: user.id,
      postId,
    },
  });

  // console.log("unlike한 포스트에 대한 노티피케이션 아이디: ", createdLike.notificationId);
  // const foundNotificationUserUnliked = await prisma.notification.delete({
  //   where: {
  //     doerName: user.id,
  //     // id: createdLike.notificationId,
  //     AND: [{ relatedPostId: postId }, {}],
  //     // doerName: user.id,
  //     // relatedPostId: postId,
  //     // id: createdLike.notificationId,
  //   },
  // });

  // const undoNotifications = await prisma.user.delete({
  //   where: {
  //     id: user.id,
  //     // notifications:
  //   },
  // });

  return NextResponse.json({ result: deletedLike }, { status: 200 });
}
