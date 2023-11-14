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
    // data = await prisma.user.findUnique({
    //   where: {
    //     id: user.id,
    //   },
    //   include: {
    //     notifications: {
    //       include: {
    //         // toWhom: true,
    //         doerLikedPost: {
    //           select: {
    //             user: {
    //               // post를 like한 유저
    //               select: {
    //                 name: true,
    //                 email: true,
    //               },
    //             },
    //             post: {
    //               select: {
    //                 title: true,
    //                 author: {
    //                   select: {
    //                     name: true,
    //                     email: true,
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    //   toWhom          User         @relation(fields: [toWhomId], references: [id])
    // userLikedPostId String
    // userLikedPost   UserLikePost @relation(fields: [userLikedPostId], references: [id], onDelete: Cascade)

    // data = await prisma.user.findUnique({
    //   // 이건 유저 테이블을 활용한 방법
    //   where: {
    //     id: user.id,
    //   },
    //   include: {
    //     notifications: {
    //       select: {
    //         toWhom: {
    //           select: {
    //             name: true,
    //             email: true,
    //           },
    //         },
    //         userLikedPost: {
    //           select: {
    //             user: {
    //               select: {
    //                 name: true,
    //                 email: true,
    //               },
    //             },
    //             postId: true,
    //             post: {
    //               select: {
    //                 title: true,
    //               },
    //             },
    //           },
    //         },
    //         userLikedComment: {
    //           select: {
    //             user: {
    //               select: {
    //                 name: true,
    //                 email: true,
    //               },
    //             },
    //             commentId: true,
    //             comment: {
    //               select: {
    //                 content: true,
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // 다른 유저가 내 포스트나 댓글에 반을 보였을떄 받은 notifications만 가져옴
    // const data = await prisma.notification.findMany({
    //   where: {
    //     recipientUserId: user.id,
    //   },
    //   include: {
    //     post: {
    //       select: {
    //         content: true,
    //         author: {
    //           select: {
    //             name: true,
    //             email: true,
    //           },
    //         },
    //       },
    //     },
    //     comment: {
    //       select: {
    //         author: {
    //           select: {
    //             name: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // data = await prisma.postNotification.findMany({
    //   where: {
    //     toWhomId: user.id,
    //   },
    // });

    const data = await prisma.user.findFirst({
      where: {
        id: user.id,
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
            commentId: true,
            notificationType: true,
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
          select: {
            id: true,
            postId: true,
            commentId: true,
            notificationType: true,
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
    // const responseNoti = await prisma.notification.create({
    //   data: {
    //     senderUserId: user.id,
    //     recipientUserId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
    //     notificationType: NotificationType.ACCEPT_INVITATION,
    //     // teamId  -> invitation에 수락 /거절하는 것에 대답에 응하는 유저의 팀 아이디가 관계가 있나? 상관이 없는 것으로 간주. 그래서 사용 X
    //   },
    // });

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

    // const invitationFound = await prisma.invitation.findFirst({
    //   where: {
    //     senderId,
    //     senderTeamId,
    //     receiverId: user.id,
    //   },
    // });
    // if (!invitationFound) {
    //   return NextResponse.json({ message: "Invitation is not found" }, { status: 404 });
    // }

    // const invitation = await prisma.invitation.update({
    //   where: {
    //     id: invitationFound.id,
    //     senderId,
    //     senderTeamId,
    //     receiverId: user.id,
    //   },
    //   data: {
    //     status: responseType,
    //   },
    // });

    // const inviteNoti = await prisma.inviteNotification.create({
    //   data: {
    //     notificationId: responseNoti.id,
    //     invitationId: invitation.id,
    //   },
    // });

    // const teamData = await prisma.team.findFirst({
    //   where: {
    //     id: senderTeamId, //Team의 아이디
    //   },
    //   select: {
    //     name: true,
    //     members: {
    //       select: {
    //         id: true,
    //       },
    //     },
    //   },
    //   //   include: {
    //   //     members: {
    //   //       include: {
    //   //         member: true,
    //   //       },
    //   //     },
    //   //   },
    // });

    // if (!teamData) {
    //   return NextResponse.json({ message: "Team is not found" }, { status: 404 });
    // }

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
    // const responseNoti = await prisma.notification.create({
    //   data: {
    //     senderUserId: senderId,
    //     recipientUserId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
    //     notificationType: NotificationType.REJECT_INVITATION,
    //   },
    // });

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

    // const invitationFound = await prisma.invitation.findFirst({
    //   where: {
    //     senderId,
    //     senderTeamId,
    //     receiverId: user.id,
    //   },
    // });
    // if (!invitationFound) {
    //   return NextResponse.json({ message: "Invitation is not found" }, { status: 404 });
    // }

    // const invitation = await prisma.invitation.update({
    //   where: {
    //     id: invitationFound.id,
    //     senderId,
    //     senderTeamId,
    //     receiverId: user.id,
    //   },
    //   data: {
    //     status: responseType,
    //   },
    // });

    // const inviteNoti = await prisma.inviteNotification.create({
    //   data: {
    //     notificationId: responseNoti.id,
    //     invitationId: invitation.id,
    //   },
    // });

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
    // const responseNoti = await prisma.notification.create({
    //   data: {
    //     senderUserId: user.id,
    //     recipientUserId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
    //     notificationType: NotificationType.ACCEPT_INVITATION,
    //     // teamId  -> invitation에 수락 /거절하는 것에 대답에 응하는 유저의 팀 아이디가 관계가 있나? 상관이 없는 것으로 간주. 그래서 사용 X
    //   },
    // });

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

    // const invitationFound = await prisma.invitation.findFirst({
    //   where: {
    //     senderId,
    //     senderTeamId,
    //     receiverId: user.id,
    //   },
    // });
    // if (!invitationFound) {
    //   return NextResponse.json({ message: "Invitation is not found" }, { status: 404 });
    // }

    // const invitation = await prisma.invitation.update({
    //   where: {
    //     id: invitationFound.id,
    //     senderId,
    //     senderTeamId,
    //     receiverId: user.id,
    //   },
    //   data: {
    //     status: responseType,
    //   },
    // });

    // const inviteNoti = await prisma.inviteNotification.create({
    //   data: {
    //     notificationId: responseNoti.id,
    //     invitationId: invitation.id,
    //   },
    // });

    // const teamData = await prisma.team.findFirst({
    //   where: {
    //     id: senderTeamId, //Team의 아이디
    //   },
    //   select: {
    //     name: true,
    //     members: {
    //       select: {
    //         id: true,
    //       },
    //     },
    //   },
    //   //   include: {
    //   //     members: {
    //   //       include: {
    //   //         member: true,
    //   //       },
    //   //     },
    //   //   },
    // });

    // if (!teamData) {
    //   return NextResponse.json({ message: "Team is not found" }, { status: 404 });
    // }

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
    // const responseNoti = await prisma.notification.create({
    //   data: {
    //     senderUserId: senderId,
    //     recipientUserId: senderId, //여기선 나한테 초대보낸사람이 받는사람이 된다.
    //     notificationType: NotificationType.REJECT_INVITATION,
    //   },
    // });

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

    // const invitationFound = await prisma.invitation.findFirst({
    //   where: {
    //     senderId,
    //     senderTeamId,
    //     receiverId: user.id,
    //   },
    // });
    // if (!invitationFound) {
    //   return NextResponse.json({ message: "Invitation is not found" }, { status: 404 });
    // }

    // const invitation = await prisma.invitation.update({
    //   where: {
    //     id: invitationFound.id,
    //     senderId,
    //     senderTeamId,
    //     receiverId: user.id,
    //   },
    //   data: {
    //     status: responseType,
    //   },
    // });

    // const inviteNoti = await prisma.inviteNotification.create({
    //   data: {
    //     notificationId: responseNoti.id,
    //     invitationId: invitation.id,
    //   },
    // });

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

// @ Post - 포스트 게시물 수정? *** 이거 옮겨서 써야됨 !!!! 잊으며안됨
// export async function PATCH(req: NextRequest) {
//   const { motherCommentId, content, postId } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에
//   // const { content } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에

//   console.log("data:::", motherCommentId, content, postId);

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

//   if (motherCommentId) {
//     const data = await prisma.comment.create({
//       data: {
//         postId, //
//         authorId: user.id,
//         content,
//         motherCommentId,
//       },
//     });
//     return NextResponse.json({ data }, { status: 200 });
//   }
// }
