"use client";

import { useSession } from "next-auth/react";
import Loader from "../_components/Loader";
import { redirect } from "next/navigation";
import NoProject from "../_components/NoProject";

import ProjectCard from "../_components/ProjectCard";
import Backdrop from "../_components/Backdrop";

import { useInView } from "react-intersection-observer";

import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getProjects } from "../libs/api";

import type { Metadata } from "next";

function generateMetadata(): Metadata {
  return {
    title: "Next.js",
  };
}

const Projects = () => {
  const { ref, inView, entry } = useInView();
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/");
  }

  const {
    data: infiniteData,
    error: infiniteDataHasError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: ({ pageParam }) => getProjects(pageParam),
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData?.lastCursor;
    },
  });

  console.log("infiniteData: ", infiniteData);

  useEffect(() => {
    console.log("hasNextPage???", hasNextPage);
    if (inView && hasNextPage) {
      console.log("Load More!!");

      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (infiniteDataHasError) {
    return <h3>something is wrong .. try it again later</h3>;
  }

  // const { data, error, isLoading } = useGetProjects();

  return (
    <div className="bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
      {status === "pending" ? (
        <Backdrop />
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="mb-2 relative">
            <h3 className="text-2xl font-semibold">
              Projects
              <p className="text-sm text-muted-foreground">Projects on which people are working</p>
            </h3>
            <div className="relative min-h-[200px] my-2 w-[700px]">
              {infiniteData?.pages?.length > 0 ? (
                infiniteData?.pages?.map((page: any) =>
                  page?.data?.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                )
              ) : (
                <NoProject />
              )}
            </div>
            {hasNextPage && (
              <div ref={ref}>
                <Loader className="w-8 h-8 animate-spin mx-auto" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
