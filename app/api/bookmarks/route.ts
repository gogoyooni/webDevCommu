import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const type = url.searchParams.get("type");
  console.log("type:::::::::::", type);

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

  //  type이 post면 bookmark 중 post 데이터 리턴
  if (type === "post") {
    const postBookmarks = await prisma.bookmarkedPost.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "SUCCESS", response: postBookmarks }, { status: 200 });
  }

  //  type이 post면 bookmark 중 project 데이터 리턴
  if (type === "project") {
    const projectBookmarks = await prisma.bookmarkedProject.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "SUCCESS", response: projectBookmarks }, { status: 200 });
  }
}

// @ Bookmarks - Make a bookmark of Posts or Projects
export async function POST(req: NextRequest) {
  const { postId, projectId } = await req.json();

  // 타입 가져오기 시작
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  // 타입 가져오기 끝

  console.log("postId, ", postId, "projectId :", projectId);

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

  let newBookmark;
  let bookmarkExists;
  try {
    //  type이 post
    if (type === "post") {
      bookmarkExists = await prisma.bookmarkedPost.findFirst({
        where: {
          userId: user.id,
          postId,
        },
      });

      if (!bookmarkExists) {
        newBookmark = await prisma.bookmarkedPost.create({
          data: {
            userId: user.id,
            postId,
          },
        });

        return NextResponse.json({ message: "SUCCESS", response: newBookmark }, { status: 200 });
      }
      return NextResponse.json(
        { message: "Already exists", response: bookmarkExists },
        { status: 409 }
      );
    }

    //  type이 project일 때
    if (type === "project") {
      bookmarkExists = await prisma.bookmarkedProject.findFirst({
        where: {
          userId: user.id,
          projectId,
        },
      });

      // projectBookmark 존재하지 않으면
      if (!bookmarkExists) {
        //  프로젝트 북마크 데이터 만들기
        newBookmark = await prisma.bookmarkedProject.create({
          data: {
            userId: user.id,
            projectId,
          },
        });

        return NextResponse.json({ message: "SUCCESS", response: newBookmark }, { status: 200 });
      }
      // projectBookmark 존재하면
      return NextResponse.json(
        { message: "Already exists", response: bookmarkExists },
        { status: 409 }
      );
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "FAIL" }, { status: 200 });
  }

  // return NextResponse.json({ message: "SUCCESS", response: newBookmark }, { status: 200 });
}

// @ Bookmarks - unbookmark Posts or Projects unbookmark하면 데이터 지운다.
export async function DELETE(req: NextRequest) {
  // const { bookmarkId, itemType, itemId } = await req.json();
  const { postId, projectId } = await req.json();

  console.log("postId : ", postId, "projectId :", projectId);

  const session: any = await getServerSession(authOptions);
  if (!session.user) {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  // 타입 가져오기 시작
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  // 타입 가져오기 끝

  if (!user) {
    return NextResponse.json({ message: "User is not found" }, { status: 403 });
  }

  let deletedBookmark;
  try {
    //  type이 post면 bookmark 중 post 데이터 리턴
    if (type === "post") {
      deletedBookmark = await prisma.bookmarkedPost.deleteMany({
        where: {
          userId: user.id,
          postId,
        },
      });

      return NextResponse.json({ message: "SUCCESS", response: deletedBookmark }, { status: 200 });
    }

    //  type이 post면 bookmark 중 project 데이터 리턴
    if (type === "project") {
      deletedBookmark = await prisma.bookmarkedProject.deleteMany({
        where: {
          userId: user.id,
          projectId,
        },
      });

      return NextResponse.json({ message: "SUCCESS", response: deletedBookmark }, { status: 200 });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "FAIL", response: deletedBookmark }, { status: 200 });
  }

  return NextResponse.json({ message: "SUCCESS", response: deletedBookmark }, { status: 200 });
}
