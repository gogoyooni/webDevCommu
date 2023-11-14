import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { NotificationType } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest, { params }: { params: { invitationId: string } }) {
  // const invitationId = params.invitationId;

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

  const data = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
    include: {
      sentInvitations: {
        select: {
          message: true,
          sender: true,
          receiver: true,
          senderTeam: true, // 프로젝트 페이지(추후에 만들예정)에 팀 아이디가 나올거야 그럼 거기서 글쓴사람의 팀아이디를 입력할 수 있게 만들어야함
          // inviteNotification: true,
        },
      },
      receivedInvitations: {
        select: {
          status: true,
          message: true,
          sender: true,
          receiver: true,
          senderTeam: true,
          // inviteNotification: true,
        },
      },
    },
  });

  return NextResponse.json(
    { sentInvitations: data?.sentInvitations, receivedInvitations: data?.receivedInvitations },
    { status: 200 }
  );
}

// export async function DELETE(req: NextRequest) {
//   // const postId = params.postId;
//   const { postId } = await req.json();
//   const session: any = await getServerSession(authOptions);
//   if (!session.user) {
//     return NextResponse.json({ message: "Not allowed" }, { status: 403 });
//   }

//   const user = await prisma.user.findFirst({
//     where: {
//       email: session?.user?.email,
//     },
//   });

//   if (!user) {
//     return NextResponse.json({ message: "User is not found" }, { status: 403 });
//   }
//   // 유저가 만든 게시물 삭제
//   const post = await prisma.post.delete({
//     where: {
//       id: postId,
//     },
//   });

//   // const project = await prisma.project.findFirst({
//   //   where: {},
//   // });

//   return NextResponse.json({ post }, { status: 200 });
// }

export async function POST(req: NextRequest) {
  //   const postId = params.postId;
  const { userEmail, teamName } = await req.json();
  const session: any = await getServerSession(authOptions);
  if (!session.user) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  if (!userEmail && !teamName) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }

  let result;
  try {
    const sender = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    if (!sender) {
      return NextResponse.json({ message: "User is not found" }, { status: 403 });
    }

    const receiver = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    if (!receiver) {
      return NextResponse.json({ message: "User is not found" }, { status: 400 });
    } else {
      const team = await prisma.team.findUnique({
        where: {
          name: teamName,
        },
      });

      console.log("찾았다 팀:", team);

      if (!team) {
        return NextResponse.json({ message: "Team is not found" }, { status: 403 });
      }

      const sendInvitationNoti = await prisma.postNotification.create({
        data: {
          toWhomId: receiver.id,
          type: NotificationType.SEND_INVITATION,
        },
      });

      // 유저가 존재한다면
      const sendInvitation = await prisma.invitation.create({
        data: {
          senderId: sender?.id,
          receiverId: receiver.id,
          senderTeamId: team?.id,
          // notification: {
          //   connect: {

          //   },
          // },
          // inviteNotification: {
          //   connectOrCreate: {
          //     where: {

          //     },
          //   },
          // },
        },
      });
      console.log("데이터가 만들어지나?", sendInvitation);

      // const inviteNoti = await prisma.inviteNotification.create({
      //   data: {
      //     notificationId: sendInvitationNoti.id,
      //     invitationId: sendInvitation.id,
      //   },
      // });

      // const createNotification = await prisma.postNotification.create({
      //   data: {

      //   }
      // })

      return NextResponse.json(
        {
          message: "Success",
          invitationData: sendInvitation,
          // inviteNotificationData: inviteNoti
        },
        { status: 200 }
      );
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

    // // 유저가 포스트를 like 할때
    // result = await prisma.userLikePost.create({
    //   data: {
    //     userId: user.id, // 포스트를 좋아요한 사람
    //     postId,
    //     // notificationId: notification.id,
    //   },
    // });

    // const notification = await prisma.postNotification.create({
    //   data: {
    //     type: NotificationType.LIKEPOST,
    //     toWhomId,
    //     userLikedPostId: result.id,
    //     // doerId: user.id, // 이 유저가 좋아요를 한거다. (그냥 userId로 되어있어서 헷갈린다)
    //     // doerName: user.name,
    //     // relatedPostId: postId,
    //   },
    // });

    // return NextResponse.json({ notification }, { status: 200 });
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

  const foundUserLikePost = await prisma.userLikePost.findFirst({
    where: {
      userId: user.id,
      postId: postId,
    },
  });

  // 유저가 포스트를 unlike 할때
  const createdLike = await prisma.userLikePost.delete({
    where: {
      id: foundUserLikePost?.id,
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

  return NextResponse.json({ createdLike }, { status: 200 });
}
