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
