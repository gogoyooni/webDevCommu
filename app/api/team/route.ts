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
