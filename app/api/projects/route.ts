import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const TAKE_COUNT = 5;

// @Project - Get Projects
export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const lastCursor = url.searchParams.get("lastCursor");
  const session: any = await getServerSession(authOptions);

  let data;
  let bookmarkedProjects: any;
  try {
    // not logged-in users see normal projects without functionality of bookmarks
    if (!session.user) {
      // 모든 프로젝트 데이터
      data = await prisma.project.findMany({
        take: TAKE_COUNT,
        ...(lastCursor && {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: lastCursor as string,
          },
        }),
        include: {
          leader: {
            select: {
              name: true,
            },
          },
          techStacks: {
            select: {
              techStack: {
                select: {
                  technologies: true,
                },
              },
            },
          },
          team: {
            select: {
              teamName: true,
              members: {
                select: {
                  member: true,
                },
              },
              _count: {
                select: {
                  members: true,
                },
              },
            },
          },
          _count: {
            select: {
              projectLikes: true,
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
      // return NextResponse.json({ message: "SUCCESS", response: data }, { status: 200 });
    } else {
      const user = await prisma.user.findFirst({
        where: {
          email: session?.user?.email,
        },
      });

      if (!user) {
        return NextResponse.json({ message: "User is not found" }, { status: 403 });
      }
      // when logged-in users come in
      data = await prisma.project.findMany({
        take: TAKE_COUNT,
        ...(lastCursor && {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: lastCursor as string,
          },
        }),
        include: {
          leader: {
            select: {
              name: true,
            },
          },
          projectLikes: {
            where: {
              userId: user.id,
            },
            select: {
              userId: true,
            },
          },
          techStacks: {
            select: {
              techStack: {
                select: {
                  technologies: true,
                },
              },
            },
          },
          team: {
            select: {
              teamName: true,
              members: {
                select: {
                  member: true,
                },
              },
              _count: {
                select: {
                  members: true,
                },
              },
            },
          },
          _count: {
            select: {
              projectLikes: true,
            },
          },
        },
      });

      // Fetch bookmarked posts for the logged-in user
      bookmarkedProjects = await prisma.bookmarkedProject.findMany({
        where: {
          userId: user.id,
        },
        select: {
          projectId: true,
        },
      });

      // Update the projects data array to include bookmark information
      data = data.map((project) => {
        return {
          ...project,
          isBookmarked: bookmarkedProjects.some((bp: any) => bp.projectId === project.id),
          isLiked: project.projectLikes.some((like: any) => like.userId === user.id),
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
      // return NextResponse.json({ message: "SUCCESS", response: data }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 200 });
  }
}
