import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// @Project - Get Projects
export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const { projectId } = params;

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
  // 모든 프로젝트 데이터
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      leader: {
        select: {
          name: true,
        },
      },
      appliedProjects: {
        select: {
          status: true,
          applicant: {
            select: {
              name: true,
              email: true,
              githubUserName: true,
            },
          },
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
  // .then((project) => project);

  return NextResponse.json({ message: "SUCCESS", response: project }, { status: 200 });
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
