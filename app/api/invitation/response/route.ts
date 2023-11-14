import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { MemberType, NotificationType, User } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest, { params }: { params: { invitationId: string } }) {
  // const invitationId = params.invitationId;
  const { responseType, senderId, senderTeamId } = await req.json();

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

  if (responseType === "ACCEPTED") {
    const responseNoti = await prisma.postNotification.create({
      data: {
        toWhomId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
        type: NotificationType.ACCEPT_INVITATION,
      },
    });

    // const invitationData = await prisma.invitation.findFirst({
    //   where: {
    //     senderId,
    //     senderTeamId,
    //     receiverId: user.id,
    //   },
    // });

    // if (!invitationData) {
    //   return NextResponse.json(
    //     {
    //       message: "Team is not found",
    //     },
    //     { status: 404 }
    //   );
    // } // 원래 했던거

    const invitationFound = await prisma.invitation.findFirst({
      where: {
        senderId,
        senderTeamId,
        receiverId: user.id,
      },
    });
    if (!invitationFound) {
      return NextResponse.json({ message: "Invitation is not found" }, { status: 404 });
    }

    const invitation = await prisma.invitation.update({
      where: {
        id: invitationFound.id,
        senderId,
        senderTeamId,
        receiverId: user.id,
      },
      data: {
        status: responseType,
      },
    });

    // const inviteNoti = await prisma.inviteNotification.create({
    //   data: {
    //     notificationId: responseNoti.id,
    //     invitationId: invitation.id,
    //   },
    // });

    const teamData = await prisma.team.findFirst({
      where: {
        id: senderTeamId, //Team의 아이디
      },
      select: {
        name: true,
        members: {
          select: {
            id: true,
          },
        },
      },
      //   include: {
      //     members: {
      //       include: {
      //         member: true,
      //       },
      //     },
      //   },
    });

    if (!teamData) {
      return NextResponse.json({ message: "Team is not found" }, { status: 404 });
    }

    const createMembershipForNewUser = await prisma.membership.create({
      data: {
        userId: user.id,
        teamId: senderTeamId,
        userType: MemberType.MEMBER,
      },
    });

    return NextResponse.json(
      {
        message: "SUCCESS/ACCEPTED",
        responseToInvitation: invitation,
        notificationData: responseNoti,
        // inviteNotificationData: inviteNoti,
        createMembershipForNewUser: createMembershipForNewUser,
      },
      { status: 200 }
    );
  } else {
    // REJECTED
    const responseNoti = await prisma.postNotification.create({
      data: {
        toWhomId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
        type: NotificationType.REJECT_INVITATION,
      },
    });

    const invitationFound = await prisma.invitation.findFirst({
      where: {
        senderId,
        senderTeamId,
        receiverId: user.id,
      },
    });
    if (!invitationFound) {
      return NextResponse.json({ message: "Invitation is not found" }, { status: 404 });
    }

    const invitation = await prisma.invitation.update({
      where: {
        id: invitationFound.id,
        senderId,
        senderTeamId,
        receiverId: user.id,
      },
      data: {
        status: responseType,
      },
    });

    // const inviteNoti = await prisma.inviteNotification.create({
    //   data: {
    //     notificationId: responseNoti.id,
    //     invitationId: invitation.id,
    //   },
    // });

    return NextResponse.json(
      {
        message: "SUCCESS/REJECTED",
        responseToInvitation: invitation,
        notificationData: responseNoti,
        // inviteNotificationData: inviteNoti,
      },
      { status: 200 }
    );
  }
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
