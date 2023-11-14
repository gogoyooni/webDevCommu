"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const AuthButton = () => {
  const { data: session } = useSession();

  //   console.log("data :: ", session);

  if (session) {
    return (
      <>
        {/* {session?.user?.name} <br /> */}
        <button className=" rounded-full text-sm bg-white px-3 py-1" onClick={() => signOut()}>
          Sign Out
        </button>
      </>
    );
  }

  return (
    <button className="rounded-full text-sm bg-white px-3 py-1" onClick={() => signIn()}>
      Sign in
    </button>
  );
};

export default AuthButton;
