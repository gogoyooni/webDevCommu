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
  const session: any = await getServerSession(authOptions);
  let data;
  if (!session?.user) {
    // return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    data = await prisma.post.findMany({
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

    return NextResponse.json({ data }, { status: 200 });
  } else {
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
      orderBy: {
        createdAt: "desc", // You can adjust the sorting based on your requirements
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
            bookmarks: true,
          },
        },
        comments: true,
        likes: true,
        // bookmarks: {
        //   where: {
        //     userId: user.id,
        //   },
        //   select: {
        //     id: true,
        //   },
        // },
      },
    });
    return NextResponse.json({ data }, { status: 200 });
  }

  // const user = await prisma.user.findFirst({
  //   where: {
  //     email: session?.user?.email,
  //   },
  // });

  // if (!user) {
  //   return NextResponse.json({ message: "User is not found" }, { status: 403 });
  // }

  console.log("서버쪽에서 data:", data);

  return NextResponse.json({ data: data }, { status: 200 });
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
