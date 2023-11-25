import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  const postId = params.postId;

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

  const data = await prisma.post.findFirst({
    where: {
      id: postId,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          image: true,
          // userLikePosts: true,
          // userLikecomments: true,
          //   postLikes: true,
        },
      },

      likes: {
        select: {
          // id: true,
          user: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },

      // likes: {
      //   select: {
      //     user: true,
      //   },
      // },
      comments: {
        select: {
          _count: {
            select: {
              likes: true,
            },
          },
          createdAt: true,
          likes: {
            select: {
              id: true,
              user: true,
              commentId: true,
              // comment: {
              //   select: {
              //     likes: {
              //       select: {
              //         id: true,
              //         user: true,
              //       },
              //     },
              //   },
              // },
            },
          },
          id: true,
          postId: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              // userLikeComments: true,
            },
          },
          motherCommentId: true,
          content: true,
          replies: {
            include: {
              _count: {
                select: {
                  likes: true,
                },
              },
              likes: {
                select: {
                  id: true,
                  user: true,
                  commentId: true,
                },
              },
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  // userLikeComments: true,
                },
              },
            },
          },
          // userLikeComments: true,
        },
      },
    },
  });
  console.log("data: ", data);

  return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  // const postId = params.postId;
  const { postId } = await req.json();
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

  // 포스트와 관련된 comment 삭제
  await prisma.comment.deleteMany({
    where: {
      postId: postId,
    },
  });

  // 포스트와 관련된 like 삭제
  await prisma.like.deleteMany({
    where: {
      postId: postId,
    },
  });

  // 유저가 만든 게시물 삭제
  const post = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  // const project = await prisma.project.findFirst({
  //   where: {},
  // });

  return NextResponse.json({ post }, { status: 200 });
}
