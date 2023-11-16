import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// @Project - POST : When a user applies for a project
export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const { status } = await req.json();
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

  let applicationResult;
  if (status === "PENDING") {
    // Get the teamId associated with the project
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        teamId: true,
      },
    });

    if (!project) {
      console.log("Project not found.");
      return NextResponse.json({ message: "Project not found" }, { status: 403 });
    }

    //  지원자가 프로젝트를 같이 하고 있는 팀원인지 체크
    const isTeamMember = await prisma.membership.findUnique({
      where: {
        userId_teamId: {
          userId: user.id,
          teamId: project.teamId, // Replace with the actual team ID associated with the project
        },
      },
    });

    if (isTeamMember) {
      // 지원자가 팀의 일원이면 지원 X
      console.log("User is already a member of the team working on the project.");
      return NextResponse.json({ message: "Already a member of the team" }, { status: 403 });
    }
    // 지원자가 이미 이 프로젝트에 지원한 적 있는지 체크
    const existingApplication = await prisma.projectApplication.findUnique({
      where: {
        applicantId_projectId: {
          applicantId: user.id,
          projectId,
        },
      },
    });

    if (existingApplication) {
      console.log("the applicant has already applied for this project");
      return NextResponse.json({ message: "Already applied" }, { status: 403 });
    }

    // 지원자 데이터 만들기
    applicationResult = await prisma.projectApplication.create({
      data: {
        applicantId: user.id,
        projectId,
        status,
      },
    });

    console.log("Application submitted successfully: ", applicationResult);
  } else {
    // 지원자가 application 쥐소 했을때
    // 지원자가 이미 이 프로젝트에 지원한 적 있는지 체크
    applicationResult = await prisma.projectApplication.delete({
      where: {
        applicantId_projectId: {
          applicantId: user.id,
          projectId,
        },
      },
    });
    console.log("Cancelled application successfully: ", applicationResult);
  }

  return NextResponse.json({ message: "SUCCESS", response: applicationResult }, { status: 200 });
}

// @ Project - Create Projects
// export async function POST(req: NextRequest) {
//   // const invitationId = params.invitationId;
//   const { title, description, teamName, userName } = await req.json();

//   console.log("title:", title, "description: ", description, "teamName:", teamName);

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

//   const teamFound = await prisma.team.findFirst({
//     where: {
//       teamName,
//     },
//     include: {
//       members: {
//         select: {
//           userId: true,
//         },
//       },
//     },
//   });

//   if (!teamFound) {
//     return NextResponse.json({ message: "Team is not found" }, { status: 400 });
//   }

//   const newProject = await prisma.project.create({
//     data: {
//       title,
//       description,
//       team: {
//         connect: { id: teamFound?.id },
//       },
//       leader: {
//         connect: { id: user?.id },
//       },
//     },
//   });

//   // 팀 멤버 아이디 가져오기
//   const teamMemberIds = [...(teamFound?.members?.map((member) => member.userId) || [])];

//   console.log("teamMemberIds:::::::::::::: :::", teamMemberIds);
//   //  팀 멤버들을 프로젝트와 다 관계 맺어주기
//   await Promise.all(
//     teamMemberIds.map(async (userId) => {
//       await prisma.projectMembership.create({
//         data: {
//           user: {
//             connect: { id: userId },
//           },
//           project: {
//             connect: { id: newProject.id },
//           },
//         },
//       });
//     })
//   );

//   return NextResponse.json({ message: "SUCCESS", response: newProject }, { status: 200 });
// }
