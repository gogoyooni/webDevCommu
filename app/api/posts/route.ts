import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Post } from "@prisma/client";

// interface Post {
//   id: string;
//   userId: string;
//   content: string;
// }

// export async function GET(req: NextRequest) {
//   const session: any = await getServerSession(authOptions);

//   if (!session.user) {
//     return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
//   }

//   const data = await prisma.post.findMany({
//     include: {
//       user: true,
//       comment: {
//         select: {
//           replies: {
//             select: {
//               content: true,
//               user: {
//                 select: {
//                   id: true,
//                   name: true,
//                   profileImage: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });
//   console.log("api route data:", data);

//   return NextResponse.json({ data }, { status: 200 });
// }

export async function GET(req: NextRequest) {
  // const session: any = await getServerSession(authOptions);
  // if (!session.user) {
  //   return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  // }

  // const user = await prisma.user.findFirst({
  //   where: {
  //     email: session?.user?.email,
  //   },
  // });

  // if (!user) {
  //   return NextResponse.json({ message: "User is not found" }, { status: 403 });
  // }

  const data = await prisma.post.findMany({
    include: {
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

  console.log("서버쪽에서 data:", data);

  return NextResponse.json({ data }, { status: 200 });
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
