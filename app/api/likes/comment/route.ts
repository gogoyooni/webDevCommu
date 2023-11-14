import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
//   const postId = params.postId;

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

//   const data = await prisma.post.findFirst({
//     where: {
//       id: postId,
//     },
//     include: {
//       user: {
//         select: {
//           name: true,
//           email: true,
//           image: true,
//           likes: true,
//           //   postLikes: true,
//         },
//       },
//       likes: {
//         select: {
//           user: true,
//         },
//       },
//       _count: {
//         select: {
//           likes: true,
//         },
//       },

//       // likes: {
//       //   select: {
//       //     user: true,
//       //   },
//       // },
//       comments: {
//         select: {
//           id: true,
//           postId: true,
//           content: true,
//           replies: true,
//         },
//       },
//     },
//   });

//   return NextResponse.json({ data }, { status: 200 });
// }

// export async function DELETE(req: NextRequest) {
//   // const postId = params.postId;
//   const { postId } = await req.json();
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
//   // 유저가 만든 게시물 삭제
//   const post = await prisma.post.delete({
//     where: {
//       id: postId,
//     },
//   });

//   // const project = await prisma.project.findFirst({
//   //   where: {},
//   // });

//   return NextResponse.json({ post }, { status: 200 });
// }

// @ comment - user likes comment
export async function POST(req: NextRequest) {
  const { userId, commentId } = await req.json();

  if (!userId || !commentId) {
    return NextResponse.json({ message: "Your request is invalid" }, { status: 400 });
  }

  const session: any = await getServerSession(authOptions);
  if (!session.user) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
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

    // 유저가 코멘트를 like 할때
    result = await prisma.like.create({
      data: {
        userId: user.id,
        commentId: commentId,
      },
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
  }

  // return NextResponse.json({ result }, { status: 200 });
}

// @ comment - user unlikes comment
export async function DELETE(req: NextRequest) {
  const { likeId, userId, commentId } = await req.json();

  console.log("likeId", likeId);

  if (!likeId || !userId || !commentId) {
    return NextResponse.json({ message: "Your request is invalid" }, { status: 400 });
  }

  const session: any = await getServerSession(authOptions);
  if (!session.user) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
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

    // 유저가 코멘트를 unllike 할때
    result = await prisma.like.delete({
      where: {
        id: likeId,
        userId: user.id,
        commentId: commentId,
      },
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 400 });
  }

  //   return NextResponse.json({ result }, { status: 200 });
}
