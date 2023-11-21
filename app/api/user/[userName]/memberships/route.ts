import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const { teamId, membershipId } = await req.json();

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
    // 1. 팀에 있는 유저의 멤버쉽 찾기 Find the user's memberships in the team
    const userMembershipsInTeam = await prisma.membership.findUnique({
      where: {
        id: membershipId,
        // userId: user.id,
        // teamId,
      },
      select: {
        teamId: true,
      },
    });

    // 2. Find the team ID from the user's memberships
    const userMembership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
      },
      select: {
        teamId: true,
      },
    });

    if (!userMembership) {
      console.error("User is not a member of any team.");
      return;
    }

    // 3. 멤버쉽과 관련된 모든 프로젝트들 가져오기
    const teamProjects = await prisma.project.findMany({
      where: {
        teamId: userMembershipsInTeam?.teamId,
      },
      select: {
        id: true,
      },
    });

    // 4. 팀에서 유저 삭제하기 Remove the user from the team
    const removedUserFromTeam = await prisma.membership.delete({
      where: {
        id: membershipId,
      },
    });

    // 5. 관련된 프로젝트에서 유저의 멤버쉽 삭제하기
    const removedUserFromProjects = await prisma.projectMembership.deleteMany({
      where: {
        userId: user.id,
        projectId: {
          in: teamProjects.map((project) => project.id),
        },
      },
    });

    const teamId = userMembership.teamId;

    // 6. 남아있는 팀 멤버 찾기
    const remainingTeamMembers = await prisma.membership.findMany({
      where: {
        teamId: teamId,
        userId: {
          not: user.id, // Exclude the user who is quitting
        },
      },
      select: {
        userId: true,
      },
    });

    // 7. 남아있는 팀 멤버들에게 notification 보내기
    const notificationPromises = remainingTeamMembers.map(async (member) => {
      const createdNotification = await prisma.notification.create({
        data: {
          notificationType: "TEAM_MEMBER_QUIT",
          isRead: false,
          senderUserId: user.id,
          recipientUserId: member.userId,
          teamId: teamId,
        },
      });

      return createdNotification;
    });

    const notifications = await Promise.all(notificationPromises);

    console.log("notifications----------------", notifications);

    return NextResponse.json(
      { message: "SUCCESS", response: removedUserFromTeam },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: e }, { status: 400 });
  }
}
