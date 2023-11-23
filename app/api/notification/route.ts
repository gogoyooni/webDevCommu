import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MemberType, NotificationType } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session: any = await getServerSession(authOptions);

  if (!session.user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
      // id:
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User is not found" }, { status: 403 });
  }

  // let data;
  try {
    const data = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        posts: true,
        likes: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            comment: {
              select: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
                post: {
                  select: {
                    author: true,
                    authorId: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
        sentNotifications: {
          select: {
            id: true,
            postId: true,
            post: true,
            commentId: true,
            comment: true,
            teamId: true,
            projectId: true,
            project: true,
            notificationType: true,
            createdAt: true,
            senderUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            recipientUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            team: {
              select: {
                id: true,
                teamName: true,
                leaderUser: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        receivedNotifications: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            postId: true,
            post: true,
            commentId: true,
            comment: true,
            teamId: true,
            projectId: true,
            project: true,
            notificationType: true,
            createdAt: true,
            senderUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            recipientUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            team: {
              select: {
                id: true,
                teamName: true,
                leaderUser: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

// @ Notifications - invitation API
export async function POST(req: NextRequest) {
  // const invitationId = params.invitationId;
  const { notificationId, userEmail, teamName, notificationType, senderId, senderTeamId } =
    await req.json();

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

  const isMember = await prisma.team.findFirst({
    where: {
      teamName,
    },
    select: {
      leaderUserId: true,
      members: {
        select: {
          member: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  console.log("isMember.members", isMember?.members);
  console.log("userEmail::", userEmail);

  const leaderId: string | undefined = isMember?.leaderUserId;
  const member: number | undefined = isMember?.members?.findIndex(
    (membership: any) => membership.member.email === userEmail
  );

  console.log("leaderId: ", leaderId, "member::", member);
  // 팀 리더가 속해있는 팀에 초대할 유저가 존재하는지 체크
  if (leaderId === user.id && (member as number) === 1) {
    return NextResponse.json({ message: "INVALID_REQUEST" }, { status: 400 });
  }

  let response;
  // 팀 리더가 초대하는 유저가 같을떄
  if (notificationType === "PENDING_INVITATION" && userEmail === user.email) {
    return NextResponse.json({ message: "INVALID_REQUEST" }, { status: 400 });
  }

  // try {
  // @ invitation 보낼떄
  //******** 초대보내기 시작
  if (notificationType === "PENDING_INVITATION") {
    const recipient = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    //   수신자 없으면 리턴
    if (!recipient) {
      return NextResponse.json({ message: "Recipient is not found" }, { status: 404 });
    }

    const team = await prisma.team.findFirst({
      where: {
        teamName,
      },
    });

    console.log("팀::::::", team);

    if (!team) {
      return NextResponse.json({ message: "Team is not found" }, { status: 404 });
    }

    const response = await prisma.notification.create({
      data: {
        notificationType: NotificationType.PENDING_INVITATION,
        senderUserId: user.id,
        recipientUserId: recipient.id,
        teamId: team.id,
      },
    });

    return NextResponse.json(
      {
        message: "SUCCESS",
        result: response,
      },
      { status: 200 }
    );
  }
  //******** 초대보내기 끝

  //***** */ 초대 수락 시작
  if (notificationType === "ACCEPT_INVITATION") {
    const responseNoti = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        // senderUserId: user.id,
        // recipientUserId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
        notificationType: NotificationType.ACCEPT_INVITATION,
        // teamId  -> invitation에 수락 /거절하는 것에 대답에 응하는 유저의 팀 아이디가 관계가 있나? 상관이 없는 것으로 간주. 그래서 사용 X
      },
    });

    const createMembershipForNewMember = await prisma.membership.create({
      data: {
        userId: user.id,
        teamId: senderTeamId,
        userType: MemberType.MEMBER,
      },
    });

    return NextResponse.json(
      {
        message: "SUCCESS/ACCEPTED",
        notification: responseNoti,
        membershipForNewUser: createMembershipForNewMember,
      },
      { status: 200 }
    );
  }

  //***** */ 초대 수락 끝

  //***** */ 초대 거절 시작
  if (notificationType === "REJECT_INVITATION") {
    const responseNoti = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        // senderUserId: senderId,
        // recipientUserId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
        notificationType: NotificationType.REJECT_INVITATION,
      },
    });

    return NextResponse.json(
      {
        message: "SUCCESS/REJECTED",
        notification: responseNoti,
        // inviteNotificationData: inviteNoti,
      },
      { status: 200 }
    );
  }
  //***** */ 초대 거절 끝
  // } catch (error) {
  // console.log(error);
  // return NextResponse.json({ message: error }, { status: 400 });
  // }

  return NextResponse.json({ message: "SUCCESS" }, { status: 200 });
}

// @ PATCH - Notification update

export async function PATCH(req: NextRequest) {
  const { notificationId, notificationType, senderId, senderTeamId } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에
  // const { content } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에

  // console.log("data:::", motherCommentId, content, postId);

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

  //***** */ 초대 수락 시작
  if (notificationType === "ACCEPT_INVITATION") {
    const responseNoti = await prisma.notification.update({
      where: {
        id: notificationId,
        // senderUserId: senderId,
        // recipientUserId: user.id,
        // notificationType: NotificationType.ACCEPT_INVITATION,
      },
      data: {
        // senderUserId: user.id,
        // recipientUserId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
        notificationType: NotificationType.ACCEPT_INVITATION,
        // teamId  -> invitation에 수락 /거절하는 것에 대답에 응하는 유저의 팀 아이디가 관계가 있나? 상관이 없는 것으로 간주. 그래서 사용 X
      },
    });

    const createMembershipForNewMember = await prisma.membership.create({
      data: {
        userId: user.id,
        teamId: senderTeamId,
        userType: MemberType.MEMBER,
      },
    });

    return NextResponse.json(
      {
        message: "SUCCESS/ACCEPTED",
        notification: responseNoti,
        membershipForNewUser: createMembershipForNewMember,
      },
      { status: 200 }
    );
  }

  //***** */ 초대 수락 끝

  //***** */ 초대 거절 시작
  if (notificationType === "REJECT_INVITATION") {
    const responseNoti = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        // senderUserId: senderId,
        // recipientUserId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
        notificationType: NotificationType.REJECT_INVITATION,
      },
    });

    return NextResponse.json(
      {
        message: "SUCCESS/REJECTED",
        notification: responseNoti,
        // inviteNotificationData: inviteNoti,
      },
      { status: 200 }
    );
  }
  //***** */ 초대 거절 끝

  if (notificationType === "CANCEL_INVITATION") {
    const responseNoti = await prisma.notification.update({
      where: {
        senderUserId: user.id,
        id: notificationId,
      },
      data: {
        notificationType: NotificationType.CANCEL_INVITATION,
      },
    });

    return NextResponse.json(
      {
        message: "SUCCESS/CANCELLED",
        notification: responseNoti,
      },
      { status: 200 }
    );
  }

  // } catch (error) {
  // console.log(error);
  // return NextResponse.json({ message: error }, { status: 400 });
  // }

  return NextResponse.json({ message: "SUCCESS" }, { status: 200 });
}
