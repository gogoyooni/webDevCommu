import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";

import { MemberType, NotificationType, ProjectStatus } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { MemberType, NotificationType } from "@prisma/client";

// @Project - Get Projects
export async function GET(req: NextRequest, { params }: { params: { teamName: string } }) {
  const url = new URL(req.url);

  const userType = url.searchParams.get("userType");

  //   console.log("userName: ", params.userName, "teamName: ", params.teamName);
  //   const teamName = url.searchParams.get("teamName");

  const { teamName } = params;

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

  let leaderProjects;
  let teamProjectsAsMember;
  try {
    if (userType === MemberType.LEADER) {
      // Retrieve projects where the user is the leader
      leaderProjects = await prisma.user
        .findUnique({
          where: { id: user.id },
          include: {
            projectsAsLeader: {
              include: {
                team: true,
              },
            },
          },
        })
        .then((user) => user?.projectsAsLeader);

      console.log("leaderProjects::::::", leaderProjects);
    } else {
      //멤버들에게 보일 데이터
      if (!teamName)
        return NextResponse.json({ message: "teamName parameter is not found" }, { status: 400 });

      const teamProjectsAsMember = await prisma.team.findUnique({
        where: { teamName },
        include: {
          members: true,
          projects: true,
        },
      });
      // .then((user) => user?.projectMemberships);
      console.log("teamProjectsAsMember::::::", teamProjectsAsMember);

      return NextResponse.json(
        { message: "SUCCESS", response: teamProjectsAsMember },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
  return NextResponse.json(
    { message: "SUCCESS", response: leaderProjects ? leaderProjects : teamProjectsAsMember },
    { status: 200 }
  );
}

// @ Project - Create Projects
export async function POST(req: NextRequest, { params }: { params: { teamName: string } }) {
  // const invitationId = params.invitationId;
  const { title, content, technologies, userName } = await req.json();

  const { teamName } = params;
  // console.log("title:", title, "description: ", description, "teamName:", teamName);

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

  const teamFound = await prisma.team.findFirst({
    where: {
      teamName,
    },
    include: {
      members: {
        select: {
          userId: true,
          userType: true,
        },
      },
    },
  });

  if (!teamFound) {
    return NextResponse.json({ message: "Team is not found" }, { status: 400 });
  }

  // 프로젝트 만드는 사람이 팀의 리더인지( 팀을 먼저 만들어야함)
  const isLeader = teamFound.members.filter(
    (member) => member.userType === "LEADER" && member.userId === user.id
  );

  if (isLeader.length === 0)
    return NextResponse.json({ message: "You should make a team first" }, { status: 403 });

  const newTechStack = await prisma.techStack.create({
    data: {
      technologies,
    },
  });

  // const techStack = await prisma.techStack.upsert({
  //   where: { technologies: technologies },
  //   update: {},
  //   create: {
  //     technologies,
  //   },
  // });

  if (!newTechStack) {
    return NextResponse.json(
      { message: "SUCCESS", response: "Techstack is not found" },
      { status: 404 }
    );
  }

  const newProject = await prisma.project.create({
    data: {
      title,
      content,
      techStackId: newTechStack.id,
      techStacks: {
        create: {
          techStack: { connect: { id: newTechStack.id } },
        },
      },
      team: {
        connect: { id: teamFound?.id },
      },
      leader: {
        connect: { id: user?.id },
      },
    },
    // include: {
    //   techStacks: true, // Include the associated tech stack details in the result
    //   // Include other relations as needed
    // },
  });

  // 팀 멤버 아이디 가져오기
  const teamMemberIds = [...(teamFound?.members?.map((member) => member.userId) || [])];

  console.log("teamMemberIds:::::::::::::: :::", teamMemberIds);
  //  팀 멤버들을 프로젝트와 다 관계 맺어주기
  await Promise.all(
    teamMemberIds.map(async (userId) => {
      await prisma.projectMembership.create({
        data: {
          user: {
            connect: { id: userId },
          },
          project: {
            connect: { id: newProject.id },
          },
        },
      });
    })
  );

  // Step 3: Notify team members about the new project
  const teamMembers = await prisma.membership.findMany({
    where: { teamId: newProject.teamId },
    select: { userId: true },
  });

  const notificationData = {
    notificationType: NotificationType.NEW_PROJECT,
    isRead: false,
    senderUserId: newProject.leaderId, // Assuming the project author sends the notification
    projectId: newProject.id,
    teamId: newProject.teamId,
  };

  // Create notifications for each team member
  const notifications = await prisma.notification.createMany({
    data: teamMembers.map((member) => ({
      ...notificationData,
      recipientUserId: member.userId,
    })),
  });

  console.log("newProject-------------", newProject);
  console.log("notifications-------------", notifications);

  return NextResponse.json(
    { message: "SUCCESS", response: newProject, notifications },
    { status: 200 }
  );
}

// @ Project - update status of a project as a leader
// Status : PROGRESS / FINISHED
export async function PATCH(req: NextRequest) {
  // const invitationId = params.invitationId;
  const { status, projectId, teamId } = await req.json();

  console.log("projectId:", projectId, "teamId: ", teamId);

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

  let projectResult;

  if (status === ProjectStatus.FINISHED) {
    // 1. 프로젝트 status update -> FINISHED
    // 2. 팀 멤버들에게도 notification

    const projectResult = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: ProjectStatus.FINISHED, // "FINISHED"
      },
    });

    // 팀 멤버들에게 notification 보내기
    const teamMembers = await prisma.membership.findMany({
      where: {
        teamId: teamId,
      },
      select: {
        userId: true,
      },
    });

    for (const member of teamMembers) {
      await prisma.notification.create({
        data: {
          notificationType: "PROJECT_STATUS_UPDATE",
          isRead: false,
          senderUserId: user.id,
          recipientUserId: member.userId,
          projectId: projectId,
        },
      });
    }

    return NextResponse.json({ message: "SUCCESS", response: projectResult }, { status: 200 });
  }

  if (status === ProjectStatus.DELETED) {
    // Update project status to DELETED
    const projectResult = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: ProjectStatus.DELETED,
      },
    });

    // 팀 멤버들에게 notification 보내기
    const teamMembers = await prisma.membership.findMany({
      where: {
        teamId: teamId,
      },
      select: {
        userId: true,
      },
    });

    for (const member of teamMembers) {
      await prisma.notification.create({
        data: {
          notificationType: "PROJECT_STATUS_UPDATE",
          isRead: false,
          senderUserId: user.id,
          recipientUserId: member.userId,
          projectId: projectId,
        },
      });
    }

    return NextResponse.json({ message: "SUCCESS", response: projectResult }, { status: 200 });
  }

  return NextResponse.json({ message: "SUCCESS", response: projectResult }, { status: 200 });
}
