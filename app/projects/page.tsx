"use client";

import { useSession } from "next-auth/react";
import { useGetProjects } from "../hooks";
import Image from "next/image";
import Link from "next/link";
import Loader from "../_components/Loader";
import { redirect } from "next/navigation";
import NoProject from "../_components/NoProject";
import { foramtDate } from "@/lib/utils";
import { LuBookmarkPlus, LuFolderX } from "react-icons/lu";
import { toast } from "@/components/ui/use-toast";
import { MdBookmark } from "react-icons/md";
import { bookmark, unbookmark } from "../libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Projects = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  if (!session?.user) {
    redirect("/");
  }

  const { data, error, isLoading } = useGetProjects();

  // Mutations
  const {
    mutate: _saveItem,
    isError: _saveItemHasError,
    isPending: _saveItemIsPending,
  } = useMutation({
    mutationFn: bookmark,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast({
        title: "FAIL",
        description: "Bookmarking failed. Try again",
      });
    },
  });

  const {
    mutate: _unbookmarkItem,
    isError: _unbookmarkItemHasError,
    isPending: _unbookmarkItemIsPending,
  } = useMutation({
    mutationFn: unbookmark,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast({
        title: "FAIL",
        description: "Unbookmarking failed",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
      {isLoading ? (
        <Loader className="mx-auto w-10 h-10 animate-spin" />
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="mb-2 relative">
            <h3 className="text-2xl font-semibold">
              Projects
              <p className="text-sm text-muted-foreground">Projects on which people are working</p>
            </h3>
            <div className="relative min-h-[200px] my-2 w-[700px]">
              {data?.response?.length > 0 ? (
                data?.response?.map((project: any) => (
                  <div
                    className="rounded-md border border-zinc-100 bg-white shadow-md p-3 flex flex-col mb-3"
                    key={project.id}
                  >
                    <div className="flex items-center  text-sm pb-2 justify-between">
                      {/* <span className="font-bold">{post.author.name}</span> */}
                      <div className="flex gap-2">
                        <span className="text-sm text-muted-foreground">
                          Led by {project?.leader?.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {foramtDate(project?.createdAt)}
                        </span>
                      </div>
                      {project?.isBookmarked ? (
                        <div
                          onClick={() => {
                            _unbookmarkItem({
                              type: "project",
                              projectId: project?.id,
                            });
                            toast({
                              title: "SUCCESS",
                              description: `Unbookmarked ${project?.title}`,
                            });
                          }}
                          className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
                        >
                          <MdBookmark className="w-5 h-5" />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            _saveItem({
                              type: "project",
                              projectId: project?.id,
                            });
                            toast({
                              title: "SUCCESS",
                              description: `Bookmarked ${project.title}`,
                            });
                          }}
                          className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
                        >
                          <LuBookmarkPlus className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <Link href={`/projects/${project.id}`}>
                      <p className="text-md">{project?.title}</p>
                      {/* <p className=""> {project?.leader?.name}</p> */}
                      {/* // todo 이거 나중에 좀 더 예쁘게 만들자 */}
                      {/* <span>🧑🏻‍💻👩🏻‍💻 : {project?.team?._count?.members}</span> */}
                      <div className="flex my-2 items-center [&>*:nth-child(even)]:ml-[-10px]">
                        {project?.team?.members?.map((team: any) => (
                          <Image
                            key={team?.member?.id}
                            className="rounded-full "
                            alt="team member"
                            src={team?.member?.image}
                            width={30}
                            height={30}
                          />
                        ))}
                      </div>
                      <p className="flex flex-wrap gap-3">
                        {project?.techStacks
                          ?.map((tech: any) => tech.techStack.technologies)[0]
                          .split(",")
                          .map((techTag: any, i: number) => (
                            <span key={i} className="text-sm bg-[#B9D9F6] p-1 rounded-md">
                              {techTag}
                            </span>
                          ))}
                      </p>
                    </Link>
                  </div>
                ))
              ) : (
                <NoProject />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
