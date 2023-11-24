import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

// @Posts - Get my posts
export async function GET(req: NextRequest, { params }: { params: { userName: string } }) {
  const { userName } = params;
  const session: any = await getServerSession(authOptions);

  console.log(userName);

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

  // Get data that a user created
  const userPosts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
    orderBy: {
      createdAt: "desc", // You can adjust the sorting based on your requirements
    },
    include: {
      author: true, // Include the author details if needed
      comments: true, // Include comments if needed
      likes: true, // Include likes if needed
    },
  });

  return NextResponse.json({ message: "SUCCESS", response: userPosts }, { status: 200 });
}

// @ Posts - Delete my posts
// export async function POST(req: NextRequest) {
//   // const invitationId = params.invitationId;
//   const { status, projectId, teamId, applicantId } = await req.json();

//   console.log("projectId:", projectId, "teamId: ", teamId, "applicantId:", applicantId);

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

//   return NextResponse.json({ message: "SUCCESS", response: updatedApplication }, { status: 200 });
// }
