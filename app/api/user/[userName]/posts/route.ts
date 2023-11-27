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

  let data;
  let bookmarkedPosts: any;

  try {
    // Get data that a user created
    data = await prisma.post.findMany({
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

    // Fetch bookmarked posts for the logged-in user
    bookmarkedPosts = await prisma.bookmarkedPost.findMany({
      where: {
        userId: user.id,
      },
      select: {
        postId: true,
      },
    });
    // Update the allPosts array to include bookmark information
    data = data.map((post) => {
      return {
        ...post,
        isBookmarked: bookmarkedPosts.some((bp: any) => bp.postId === post.id),
      };
    });

    return NextResponse.json({ message: "SUCCESS", response: data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
  }

  // return NextResponse.json({ message: "SUCCESS", response: data }, { status: 200 });
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
