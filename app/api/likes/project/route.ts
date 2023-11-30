import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NotificationType } from "@prisma/client";

export async function POST(req: NextRequest) {
  //   const postId = params.postId;
  const projectId = await req.json();

  const session: any = await getServerSession(authOptions);

  if (!session.user) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  if (!projectId) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 400 });
  }

  let result;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User is not found" }, { status: 403 });
    }

    // Create ProjectLike record
    const newProjectLike = await prisma.projectLike.create({
      data: {
        projectId: projectId,
        userId: user.id,
      },
    });

    // Get project details
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        team: true,
        leader: true,
        projectMemberships: true,
      },
    });

    if (!project) {
      return NextResponse.json({ message: "Fail to get project details" }, { status: 200 });
    }

    // Notify project leader
    await prisma.notification.create({
      data: {
        notificationType: "LIKE_PROJECT",
        senderUserId: user.id,
        recipientUserId: project?.leaderId,
        projectId: projectId,
      },
    });

    // Notify project team members
    for (const membership of project?.projectMemberships) {
      await prisma.notification.create({
        data: {
          notificationType: "LIKE_PROJECT",
          senderUserId: user.id,
          recipientUserId: membership.userId,
          projectId: projectId,
        },
      });
    }

    return NextResponse.json({ message: "SUCCESS" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  //   const postId = params.postId;
  const { projectId } = await req.json();
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

  // Create ProjectLike record
  const projectUnlike = await prisma.projectLike.deleteMany({
    where: {
      projectId: projectId,
    },
  });

  return NextResponse.json({ result: projectUnlike }, { status: 200 });
}
