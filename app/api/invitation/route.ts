import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import { getServerSession } from "next-auth";
import { NotificationType } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PATCH(req: NextRequest, { params }: { params: { invitationId: string } }) {
  // const invitationId = params.invitationId;

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

  return NextResponse.json({ message: "SUCCESS", response: "" }, { status: 200 });
}
