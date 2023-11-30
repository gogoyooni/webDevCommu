"use client";

import { useSession } from "next-auth/react";
import { useGetProjects } from "../hooks";
import Loader from "../_components/Loader";
import { redirect } from "next/navigation";
import NoProject from "../_components/NoProject";

import ProjectCard from "../_components/ProjectCard";

const Projects = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/");
  }

  const { data, error, isLoading } = useGetProjects();

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
                  <ProjectCard key={project.id} project={project} />
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
