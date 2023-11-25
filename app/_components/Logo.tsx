"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

function Logo() {
  const { data: session } = useSession();

  return (
    <>
      <Link className="font-bold text-xl" href="/">
        DevComm
      </Link>
      {/* <Link href={`/notification/${session?.user?.name}`}>Notification</Link> */}
      {/* <Link href={`/team`}>Team</Link> */}
      {/* <Link href={`/user/${session?.user?.name}/teams`}>My teams</Link>
      <Link href={`/user/${session?.user?.name}/projects`}>My Projects</Link>
      <Link href={`/projects`}>Projects</Link> */}
      {/* <Link href={`/user/${session?.user?.name}/projects`}>My Projects</Link> */}
      {/* <Link href={`/team/create`}>Create Team</Link>
      <Link href={`/invitation`}>Invitation</Link> */}
    </>
  );
}

export default Logo;
