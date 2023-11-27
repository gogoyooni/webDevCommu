import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// @Project - Get Projects
export async function GET(req: NextRequest) {
  const session: any = await getServerSession(authOptions);

  let data;
  let bookmarkedProjects: any;
  try {
    // not logged-in users see normal projects without functionality of bookmarks
    if (!session.user) {
      // 모든 프로젝트 데이터
      data = await prisma.project.findMany({
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
        },
      });

      return NextResponse.json({ message: "SUCCESS", response: data }, { status: 200 });
    } else {
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
      // when logged-in users come in
      data = await prisma.project.findMany({
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
        };
      });

      return NextResponse.json({ message: "SUCCESS", response: data }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 200 });
  }
}
