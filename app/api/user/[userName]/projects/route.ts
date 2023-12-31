import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { ApplicationStatus, MemberType, NotificationType, ProjectStatus } from "@prisma/client";

// @Project - Get Projects
export async function GET(req: NextRequest, { params }: { params: { userName: string } }) {
  const { userName } = params;
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
  // 유저가 리더로서 또는 멤버로서 작업하고 있는 프로젝트 데이터 다 가져오기
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { leaderId: user.id }, // 유저가 리더인지 체크
        // { projectMemberships: { some: { userId: user.id } } }, // 유저가 프로젝트의 멤버인지 체크 -> 추후에 팀 멤버쉽을 유지하면서 프로젝트에서는 빠질 수 있도록 구현하기
        { team: { members: { some: { userId: user.id } } } }, // 유저가 멤버인지 체크
      ],
    },
    include: {
      appliedProjects: {
        select: {
          status: true,
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              githubUserName: true,
            },
          },
        },
      },
      team: {
        select: {
          teamName: true,
          description: true,
          goal: true,
          members: {
            select: {
              member: true,
            },
          },
          leaderUser: {
            select: {
              name: true,
            },
          },
        },
      }, // Include team information
      projectMemberships: {
        select: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ message: "SUCCESS", response: projects }, { status: 200 });
}

// @ Project Application - Accept / Reject applicants who applied for a project
export async function POST(req: NextRequest) {
  // const invitationId = params.invitationId;
  const { status, projectId, teamId, applicantId } = await req.json();

  console.log("projectId:", projectId, "teamId: ", teamId, "applicantId:", applicantId);

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

  if (status === ApplicationStatus.ACCEPTED) {
    // Accept an Applicant and Add as a Team Member
    const updatedApplication = await prisma.projectApplication.update({
      where: {
        applicantId_projectId: {
          applicantId,
          projectId: projectId,
        },
      },
      data: {
        status, // "ACCEPTED"
      },
    });

    // Add the accepted applicant as a team member
    await prisma.membership.create({
      data: {
        userId: user.id,
        teamId: teamId,
        userType: MemberType.MEMBER, // or whatever default user type you want for members
      },
    });

    // Send Notifications to Team Members
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
          notificationType: NotificationType.APPLICATION_RESULT,
          isRead: false,
          senderUserId: user.id, // 보내는 사람은 프로젝트 리더(지원자 합격/불합격 시킨 사람)
          recipientUserId: member.userId,
          projectId: projectId,
          // Include any other relevant information in the notification
        },
      });
    }

    return NextResponse.json({ message: "SUCCESS", response: updatedApplication }, { status: 200 });
  }

  // Reject an applicant

  // Accept an Applicant and Add as a Team Member
  const updatedApplication = await prisma.projectApplication.update({
    where: {
      applicantId_projectId: {
        applicantId,
        projectId: projectId,
      },
    },
    data: {
      status, // "REJECTED"
    },
  });

  // Send Notifications to Team Members
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
        notificationType: NotificationType.APPLICATION_RESULT,
        isRead: false,
        senderUserId: user.id, // 보내는 사람은 프로젝트 리더(지원자 합격/불합격 시킨 사람)
        recipientUserId: member.userId,
        projectId: projectId,
        // Include any other relevant information in the notification
      },
    });
  }

  return NextResponse.json({ message: "SUCCESS", response: updatedApplication }, { status: 200 });
}

// @ Project - delete : delete a project
// Status : PROGRESS / FINISHED / DELETED
// export async function DELETE(req: NextRequest) {
//   // const invitationId = params.invitationId;
//   const { projectId, teamId } = await req.json();

//   console.log("projectId:", projectId, "teamId: ", teamId);

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

//   let projectResult;

//   // Update project status to DELETED // deleted 상태로 바뀐 프로젝트를 지울 것인지 아닐 것인기 고민해봐야함
//   projectResult = await prisma.project.update({
//     where: {
//       id: projectId,
//     },
//     data: {
//       status: ProjectStatus.DELETED,
//     },
//   });

//   // 팀 멤버들에게 notification 보내기
//   const teamMembers = await prisma.membership.findMany({
//     where: {
//       teamId: teamId,
//     },
//     select: {
//       userId: true,
//     },
//   });

//   for (const member of teamMembers) {
//     await prisma.notification.create({
//       data: {
//         notificationType: "PROJECT_STATUS_UPDATE",
//         isRead: false,
//         senderUserId: user.id,
//         recipientUserId: member.userId,
//         projectId: projectId,
//       },
//     });
//   }

//   return NextResponse.json({ message: "SUCCESS", response: projectResult }, { status: 200 });
// }
