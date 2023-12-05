import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Post } from "@prisma/client";

const TAKE_COUNT = 5;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const lastCursor = url.searchParams.get("lastCursor");
  // if (!lastCursor) {
  // return NextResponse.json({ message: "Invalid request, missing id parameter" }, { status: 400 });
  // }

  // const pageCondition = {
  //   skip: 1,
  //   cursor: {
  //     id: lastCursor as string,
  //   },
  // };
  const session: any = await getServerSession(authOptions);

  // const { offset = 0, limit = 5 } = await req.query;
  let data;
  try {
    if (!session?.user) {
      // return NextResponse.json({ message: "Not allowed" }, { status: 403 });
      data = await prisma.post.findMany({
        take: TAKE_COUNT,
        ...(lastCursor && {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: lastCursor as string,
          },
        }),
        include: {
          comments: {
            select: {
              id: true, // Include any other comment fields you need
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      if (data.length == 0) {
        return new Response(
          JSON.stringify({
            data: [],
            metaData: {
              lastCursor: null,
              hasNextPage: false,
            },
          }),
          { status: 200 }
        );
      }

      const lastPostInResults: any = data[data.length - 1];
      const cursor: any = lastPostInResults.id;

      const nextPage = await prisma.post.findMany({
        // Same as before, limit the number of events returned by this query.
        take: TAKE_COUNT,
        skip: 1, // Do not include the cursor itself in the query result.
        cursor: {
          id: cursor,
        },
      });

      return NextResponse.json(
        {
          data,
          metaData: {
            lastCursor: cursor,
            hasNextPage: nextPage.length > 0,
          },
        },
        { status: 200 }
      );
    }

    if (session?.user) {
      // 유저가 로그인한 상태이면
      const user = await prisma.user.findFirst({
        where: {
          email: session?.user?.email,
        },
      });

      if (!user) {
        return NextResponse.json({ message: "User is not found" }, { status: 403 });
      }
      // Retrieve posts with information about whether they are bookmarked by the user
      data = await prisma.post.findMany({
        take: TAKE_COUNT,
        ...(lastCursor && {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: lastCursor as string,
          },
        }),
        orderBy: {
          createdAt: "desc", // You can adjust the sorting based on your requirements
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          comments: true,
          likes: true,
        },
      });

      // Fetch bookmarked posts for the logged-in user
      const bookmarkedPosts = await prisma.bookmarkedPost.findMany({
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
          isBookmarked: bookmarkedPosts.some((bp) => bp.postId === post.id),
        };
      });

      if (data.length == 0) {
        return new Response(
          JSON.stringify({
            data: [],
            metaData: {
              lastCursor: null,
              hasNextPage: false,
            },
          }),
          { status: 200 }
        );
      }

      const lastPostInResults: any = data[data.length - 1];
      const cursor: any = lastPostInResults.id;

      const nextPage = await prisma.post.findMany({
        // Same as before, limit the number of events returned by this query.
        take: TAKE_COUNT,
        skip: 1, // Do not include the cursor itself in the query result.
        cursor: {
          id: cursor,
        },
      });

      return NextResponse.json(
        {
          data,
          metaData: {
            lastCursor: cursor,
            hasNextPage: nextPage.length > 0,
          },
        },
        { status: 200 }
      );
      // return NextResponse.json(
      //   {
      //     data,
      //     metaData: {
      //       lastCursor: null,
      //       hasNextPage: false,
      //     },
      //   },
      //   { status: 200 }
      // );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "FAIL" }, { status: 500 });
  }

  // console.log("서버쪽에서 data:", data);

  // return NextResponse.json({ message: "SUCCESS" }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const { title, content } = await req.json(); // 프론트단에서 이거 넣어줘야됨 나중에
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

  const createdPost = await prisma.post.create({
    data: {
      title,
      content,

      authorId: user?.id as string,
    },
  });

  return NextResponse.json({ createdPost }, { status: 200 });
}
