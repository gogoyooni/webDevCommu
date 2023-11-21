import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { MemberType } from "@prisma/client";

export async function GET(req: NextRequest) {
  // const { name, description, goal }: { name: string; description: string; goal: string } =
  //   await req.json();

  const session: any = await getServerSession(authOptions);

  if (!session.user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User is not found" }, { status: 403 });
  }

  let data;

  try {
    // 유저가 만든 팀 또는 속해있는 팀 가져오기..

    // const teamUserJoined = await prisma.user.findUnique({
    //   where: {
    //     id: user.id,
    //   },
    //   include: {
    //     membership: {
    //       select: {
    //         member: true,
    //         userType: true,
    //         team: true,
    //       },
    //     },
    //   },
    // });

    // const teamUserJoined = await prisma.team.findMany({ // 이건 유저가 리더인 팀만 나올 가능성인 높음..
    //   where: {
    //     leaderId: user.id,
    //   },
    //   include: {
    //     membership: {
    //       include: {
    //         member: {
    //           select: {
    //             name: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // const teamUserJoined = await prisma.user.findUnique({
    //   where: {
    //     id: user.id,
    //   },
    //   include: {
    //     teams: {
    //       select: {
    //         name: true,
    //         description: true,
    //         goal: true,
    //         invitations: true,
    //         membership: {
    //           select: {
    //             userType: true,
    //             // userId,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // const teamUserJoined = await prisma.team.findMany({
    //   where: {
    //     leaderId: user.id,
    //     // AND: [
    //     //     { member }, // age가 20보다 큰 사용자
    //     //     { OR: [
    //     //       { name: { contains: "John" } }, // 이름에 "John"이 포함된 사용자
    //     //       { email: { endsWith: "@example.com" } } // 이메일이 "@example.com"으로 끝나는 사용자
    //     //     ]}
    //     //   ]
    //   },
    //   include: {
    //     members: {
    //       select: {
    //         userType: true,
    //       },
    //     },
    //     _count: {
    //       select: {
    //         members: true,
    //       },
    //     },
    //   },
    // });

    const teamUserJoined = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      include: {
        memberships: {
          include: {
            member: true,
            team: {
              select: {
                teamName: true,
                description: true,
                members: true,
              },
            },
            // team: {
            //   select: {
            //     name: true,
            //   },
            // },
          },
        },
        _count: {
          select: {
            memberships: true,
          },
        },
      },
    });

    // 내가 멤버로 있는 팀 데이터
    // const teamUserJoinedAsMember = await prisma.user.findFirst({
    //   where: {
    //     id: user.id,
    //   },
    //   include: {
    //     memberships: {
    //       include: {
    //         member: true,
    //         team: true,
    //         // team: {
    //         //   select: {
    //         //     name: true,
    //         //   },
    //         // },
    //       },
    //     },
    //     _count: {
    //       select: {
    //         memberships: true,
    //       },
    //     },
    //   },
    // });

    console.log("유저가 가지고 있는 멤버쉽 데이터: ", teamUserJoined);

    return NextResponse.json({ userData: teamUserJoined }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const { name, description, goal }: { name: string; description: string; goal: string } =
    await req.json();

  const session: any = await getServerSession(authOptions);

  if (!session.user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User is not found" }, { status: 403 });
  }

  //   let data;

  try {
    const createTeam = await prisma.team.create({
      data: {
        leaderUserId: user.id,
        teamName: name,
        description,
        goal,
      },
    });

    // 멤버쉽 생성
    const createMembership = await prisma.membership.create({
      data: {
        userId: user.id,
        teamId: createTeam.id,
      },
    });

    // 유저가 팀 처음 만들면 디폴트로 리더가 된다.(다른사람한테 바꿔주는 기능도 해볼까?...시간있으면..)
    const updateMembership = await prisma.membership.update({
      where: {
        id: createMembership.id,
      },
      data: {
        teamId: createTeam.id,
        userType: MemberType.LEADER,
      },
    });

    return NextResponse.json(
      { teamData: createTeam, membershipData: updateMembership },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { teamId }: { teamId: string } = await req.json();

  const session: any = await getServerSession(authOptions);

  if (!session.user) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User is not found" }, { status: 403 });
  }

  //   let data;

  try {
    // 1. 유저가 리더로 있던 팀을 찾는다
    const userTeam = await prisma.team.findFirst({
      where: {
        leaderUserId: user.id,
      },
      include: {
        projects: true, // Include the associated projects
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!userTeam) {
      console.error("User is not a leader of any team.");
      return NextResponse.json({ message: "User is not a leader of any team." }, { status: 400 });
    }

    // 2. 유저가 리더로 있던 팀과 관련된 프로젝트를 삭제한다
    const deletedProjects = await prisma.project.deleteMany({
      where: {
        id: {
          in: userTeam.projects.map((project) => project.id),
        },
      },
    });

    // 3. 팀 멤버들을 찾는다
    const teamMembers = await prisma.membership.findMany({
      where: {
        teamId: teamId,
      },
      select: {
        userId: true,
      },
    });

    // 4. 팀 멤버들에게 팀 삭제 사실을 notification 알린다.
    const notificationPromises = teamMembers.map(async (member) => {
      const createdNotification = await prisma.notification.create({
        data: {
          notificationType: "TEAM_DELETED",
          isRead: false,
          senderUserId: user.id,
          recipientUserId: member.userId,
          teamId: teamId,
          // Include any other relevant information in the notification
        },
      });

      return createdNotification;
    });

    const notifications = await Promise.all(notificationPromises);

    // 5. 팀 멤버들의 멤버쉽을 삭제한다
    const deletedMemberships = await prisma.membership.deleteMany({
      where: {
        userId: {
          in: userTeam.members.map((member) => member.userId),
        },
      },
    });

    // 6: 팀을 삭제한다
    const deletedTeam = await prisma.team.delete({
      where: {
        id: teamId,
      },
    });

    console.log("Notifications to the remaining members ::", notifications);

    return NextResponse.json({ message: "SUCCESS", response: deletedTeam }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
