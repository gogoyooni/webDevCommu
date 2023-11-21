import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ItemType } from "@prisma/client";

// @ Bookmarks - Make a bookmark of Posts or Projects
export async function POST(req: NextRequest) {
  const { itemType, itemId } = await req.json();

  console.log("itemType : ", itemType, "itemId :", itemId);

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

  //  프로젝트 북마크 데이터 만들기
  newBookmark = await prisma.bookmark.create({
    data: {
      userId: user.id,
      itemType,
      itemId,
    },
  });

  return NextResponse.json({ message: "SUCCESS", response: newBookmark }, { status: 200 });
}

// @ Bookmarks - unbookmark Posts or Projects unbookmark하면 데이터 지운다.
export async function DELETE(req: NextRequest) {
  const { bookmarkId, itemType, itemId } = await req.json();

  console.log("itemType : ", itemType, "itemId :", itemId);

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

  //  북마크에서 삭제하기
  newBookmark = await prisma.bookmark.delete({
    where: {
      id: bookmarkId,
      userId: user.id,
      itemType,
      itemId,
    },
  });

  return NextResponse.json({ message: "SUCCESS", response: newBookmark }, { status: 200 });
}
