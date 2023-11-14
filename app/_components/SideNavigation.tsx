"use client";

import { GrGroup } from "react-icons/gr";
import { GoProjectRoadmap } from "react-icons/go";
import { LuBell } from "react-icons/lu";
import { LuFingerprint } from "react-icons/lu";
import { LuFolderTree } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { LuLogIn } from "react-icons/lu";
import { LuUsers2 } from "react-icons/lu";
import { LuKeyboard } from "react-icons/lu";
import { LuHome } from "react-icons/lu";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SideNavigation = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  console.log("pathname:", pathname);
  return (
    // <aside className="absolute left-0 h-screen w-[70px]">
    <aside className="h-screen w-[70px] pt-5 border-r-[1px] border-zinc-200">
      <ul className="flex flex-col gap-2">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className={`p-2 mx-auto rounded-lg transition-colors ease-in hover:bg-slate-200 ${
                  pathname === "/" ? "bg-slate-200" : ""
                }`}
              >
                <Link href={"/"}>
                  <LuHome className="w-[25px] h-[25px]" />
                </Link>
              </li>
            </TooltipTrigger>
            <TooltipContent
              className="border border-slate-300 bg-white text-black"
              side="right"
              sideOffset={10}
            >
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <li className="p-2 mx-auto rounded-lg bg-sky-300">
          <GoProjectRoadmap className="w-[25px] h-[25px]" />
        </li> */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className={`p-2 mx-auto rounded-lg transition-colors ease-in hover:bg-slate-200 ${
                  pathname === "/projects" ? "bg-slate-200" : ""
                }`}
              >
                <Link href={"/projects"}>
                  <LuKeyboard className="w-[25px] h-[25px]" />
                </Link>
              </li>
            </TooltipTrigger>
            <TooltipContent
              className="border border-slate-300 bg-white text-black"
              side="right"
              sideOffset={10}
            >
              <p>Projects</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="px-2 mx-auto w-[25px] border-b-[1px] border-zinc-200"></span>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className={`p-2 mx-auto rounded-lg transition-colors ease-in hover:bg-slate-200 ${
                  pathname === `/user/${encodeURI(session?.user?.name as string)}/posts`
                    ? "bg-slate-200"
                    : ""
                }`}
              >
                <Link href={`/user/${session?.user?.name}/posts`}>
                  <LuFingerprint className="w-[25px] h-[25px]" />
                </Link>
                {/* //My Posts */}
              </li>
            </TooltipTrigger>
            <TooltipContent
              className="border border-slate-300 bg-white text-black"
              side="right"
              sideOffset={10}
            >
              <p>My Posts</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className={`p-2 mx-auto rounded-lg transition-colors ease-in hover:bg-slate-200 ${
                  pathname === `/user/${encodeURI(session?.user?.name as string)}/teams`
                    ? "bg-slate-200"
                    : ""
                }`}
              >
                {/* <GrGroup className="w-[25px] h-[25px]" /> */}
                <Link href={`/user/${session?.user?.name}/teams`}>
                  <LuUsers2 className="w-[25px] h-[25px]" />
                </Link>
                {/* //My Teams */}
              </li>
            </TooltipTrigger>
            <TooltipContent
              className="border border-slate-300 bg-white text-black"
              side="right"
              sideOffset={10}
            >
              <p>My Teams</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className={`p-2 mx-auto rounded-lg transition-colors ease-in hover:bg-slate-200 ${
                  pathname === `/user/${encodeURI(session?.user?.name as string)}/projects`
                    ? "bg-slate-200"
                    : ""
                }`}
              >
                <Link href={`/user/${session?.user?.name}/projects`}>
                  <LuFolderTree className="w-[25px] h-[25px]" />
                </Link>
                {/* My Projects */}
              </li>
            </TooltipTrigger>
            <TooltipContent
              className="border border-slate-300 bg-white text-black"
              side="right"
              sideOffset={10}
            >
              <p>My Projects</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className={`p-2 mx-auto rounded-lg transition-colors ease-in hover:bg-slate-200 ${
                  pathname === `/user/${encodeURI(session?.user?.name as string)}/notifications`
                    ? "bg-slate-200"
                    : ""
                }`}
              >
                <Link href={`/user/${session?.user?.name}/notifications`}>
                  <LuBell className="w-[25px] h-[25px]" />
                </Link>

                {/* notifications */}
              </li>
            </TooltipTrigger>
            <TooltipContent
              className="border border-slate-300 bg-white text-black"
              side="right"
              sideOffset={10}
            >
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="px-2 mx-auto w-[25px] border-b-[1px] border-zinc-200"></span>
        {/* // 로그인 /로그아웃 */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <li className="p-2 mx-auto rounded-lg transition-colors ease-in hover:bg-slate-200">
                {session?.user ? (
                  <LuLogOut onClick={() => signOut()} className="w-[25px] h-[25px]" />
                ) : (
                  <LuLogIn onClick={() => signIn()} className="w-[25px] h-[25px]" />
                )}
              </li>
            </TooltipTrigger>

            <TooltipContent
              className="border border-slate-300 bg-white text-black"
              side="right"
              sideOffset={10}
            >
              <p>{session?.user ? "Log out" : "Log in"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ul>
    </aside>
  );
};

export default SideNavigation;