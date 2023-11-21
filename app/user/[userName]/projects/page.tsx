"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetMyProjects } from "@/app/hooks";
import { acceptApplication } from "@/app/libs/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ApplicationStatus, ProjectStatus } from "@prisma/client";
import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { LuNavigation, LuSailboat, LuCrown, LuCupSoda, LuFolderPlus } from "react-icons/lu";
import {} from "react-icons/lu";
import {} from "react-icons/lu";

import Image from "next/image";
import ProjectAction from "@/app/_components/ProjectAction";
import Loader from "@/app/_components/Loader";

const Projects = ({ params }: { params: { userName: string } }) => {
  const { userName } = params;

  const { data, error, isLoading } = useGetMyProjects(userName);

  if (error) return <div>Something is wrong. Try again later</div>;

  //   const {} = useAcceptApplication();

  const { data: session } = useSession();

  const {
    mutate: _acceptApplication,
    isError: _accpetApplicationHasError,
    isPending: _accpetApplicationIsPending,
  } = useMutation({
    mutationFn: (data: any) => acceptApplication(data),
    onSuccess: () => {
      const queryClient = useQueryClient();
      // Invalidate and refetch

      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast({
        title: `You accepted ${data.applicant.name} as a member for your project`,
        variant: "default",
      });
    },
  });

  const {
    mutate: _rejectApplication,
    isError: _rejectApplicationHasError,
    isPending: _rejectApplicationIsPending,
  } = useMutation({
    mutationFn: (data: any) => acceptApplication(data),
    onSuccess: () => {
      const queryClient = useQueryClient();

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast({
        title: `You rejected ${data.applicant.name} as a member for your project`,
        variant: "destructive",
      });
    },
  });

  //   const useAcceptApplication = (projectId: string) => {
  //     // const queryClient = useQueryClient();
  //     // Mutations
  //     const { data, mutate, isError, isPending } = useMutation({
  //       mutationFn: (data: any) => acceptApplication(data, projectId),
  //       onSuccess: () => {
  //         // Invalidate and refetch
  //         queryClient.invalidateQueries({ queryKey: ["project"] });
  //       },
  //     });

  //     return {
  //       data,
  //       mutate,
  //       isError,
  //       isPending,
  //     };
  //   };

  console.log(data);

  const projectsAsLeader =
    data?.response?.length > 0 &&
    data?.response?.filter(
      (project: any) =>
        project?.team?.leaderUser?.name === decodeURIComponent(userName) &&
        project?.status === ProjectStatus.PROGRESS
    );
  const finishedProjectsAsLeader =
    data?.response?.length > 0 &&
    data?.response?.filter(
      (project: any) =>
        project?.team?.leaderUser?.name === decodeURIComponent(userName) &&
        project?.status === ProjectStatus.FINISHED
    );

  // console.log("finishedProjectsAsLeader", finishedProjectsAsLeader);
  // let applicantsForLeaderProject =
  //   projectsAsLeader?.length > 0 &&
  //   projectsAsLeader?.flatMap((application: any) => application.appliedProjects);

  // console.log("applicantsForLeaderProject", applicantsForLeaderProject);
  const projectsAsMember =
    data?.response?.length > 0 &&
    data?.response?.filter(
      (project: any) =>
        project?.team?.leaderUser?.name !== decodeURIComponent(userName) &&
        project?.status === ProjectStatus.PROGRESS
    );

  const finishedProjectsAsMember =
    data?.response?.length > 0 &&
    data?.response?.filter(
      (project: any) =>
        project?.team?.leaderUser?.name !== decodeURIComponent(userName) &&
        project?.status === ProjectStatus.FINISHED
    );

  console.log("project as leader:", projectsAsLeader);

  // console.log("applicants of project as a leader ::", projectsAsLeader?.appliedProjects);
  console.log("project as member: ", projectsAsMember);

  return (
    <div className="bg-[#F5F5F5] w-full min-h-screen max-h-full pt-4 pb-9">
      {isLoading ? (
        <Loader className="mx-auto w-10 h-10 animate-spin" />
      ) : (
        <>
          {/* <h3>{`/user/${decodeURIComponent(userName)}/projects`}</h3> */}
          <div className="mx-auto max-w-6xl">
            {/* // inner side Nav */}
            <div className="p-2 mb-2">
              <h3 className="text-2xl font-semibold">
                {/* Hello, {session?.user?.name}!  */}
                My Projects as a leader
                {projectsAsLeader?.length > 0 && JSON.stringify(projectsAsLeader?.appliedProjects)}
                <p className="text-sm text-muted-foreground">Projects You're On</p>
              </h3>
            </div>

            <div>
              {/* <h3>Project as a leader</h3> */}
              {/* <div className="flex gap-5 justify-center"> */}
              <div className="grid grid-cols-4 gap-5 justify-center">
                <div className="relative w-[270px] p-4 shadow-md rounded-lg bg-white border-zinc-100 border-[1px]">
                  <h3 className="font-medium text-sm">Ongoing Projects as a Leader</h3>
                  <p className="mt-5 text-5xl font-semibold">
                    {projectsAsLeader.length > 0 ? projectsAsLeader.length : 0}
                  </p>
                  <LuNavigation className="absolute bottom-[0px] right-[30px] w-[50px] h-[50px]" />
                </div>
                <div className="relative w-[270px] p-4 shadow-md rounded-lg bg-white border-zinc-100 border-[1px]">
                  <h3 className="font-medium text-sm">Finished Projects as a Leader</h3>
                  <p className="mt-5 text-5xl font-semibold">
                    {finishedProjectsAsLeader.length > 0 ? finishedProjectsAsLeader.length : 0}
                  </p>
                  <LuCrown className="absolute bottom-[0px] right-[30px] w-[50px] h-[50px]" />
                </div>
                <div className="relative w-[270px] p-4 shadow-md rounded-lg bg-white border-zinc-100 border-[1px]">
                  <h3 className="font-medium text-sm">Ongoing Projects as a Member</h3>
                  <p className="mt-5 text-5xl font-semibold">
                    {projectsAsMember.length > 0 ? projectsAsMember.length : 0}
                  </p>
                  <LuSailboat className="absolute bottom-[0px] right-[30px] w-[50px] h-[50px]" />
                </div>
                <div className="relative w-[270px] p-4 shadow-md rounded-lg bg-white border-zinc-100 border-[1px]">
                  <h3 className="font-medium text-sm">Finished Projects as a Member</h3>
                  <p className="mt-5 text-5xl font-semibold">
                    {finishedProjectsAsMember.length > 0 ? finishedProjectsAsMember.length : 0}
                  </p>
                  <LuCupSoda className="absolute bottom-[0px] right-[30px] w-[50px] h-[50px]" />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <Tabs
                defaultValue={`${
                  projectsAsLeader.length > 0 ? "projectAsLeader" : "projectAsMember"
                }`}
                className=""
              >
                <TabsList className="grid w-full grid-cols-2 gap-5">
                  <TabsTrigger value="projectAsLeader">Ongoing Projects as Leader</TabsTrigger>
                  <TabsTrigger value="projectAsMember">Ongoing Projects as Member</TabsTrigger>
                </TabsList>
                <TabsContent value="projectAsLeader">
                  <div className="p-2 mt-3">
                    <h3 className="text-xl font-medium mb-2">Ongoing Projects as a Leader</h3>
                    {projectsAsLeader.length === 0 && (
                      <div className="grid grid-cols-1 p-4 shadow-md rounded-lg bg-white border-zinc-100 border-[1px] justify-center cursor-pointer">
                        <div className="flex items-center justify-center gap-3">
                          <LuFolderPlus className="w-7 h-7 text-muted-foreground" />
                          <span className="text-2xl text-muted-foreground">
                            Create a project as a Leader
                          </span>
                        </div>
                      </div>
                    )}
                    {projectsAsLeader.length > 0 &&
                      projectsAsLeader?.map((project: any) => (
                        <div className="flex gap-5 justify-center">
                          <div
                            className="my-2 w-[560px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]"
                            key={project.teamId}
                          >
                            <span className="text-sm text-muted-foreground">Project</span>
                            <div className="flex items-center justify-between">
                              <p>{project.title}</p>
                              <ProjectAction
                                data={{
                                  membership: "LEADER",
                                  projectId: project.id,
                                  teamId: project.teamId,
                                  userName: decodeURI(userName),
                                  teamName: project.team.teamName,
                                  status: "",
                                }}
                              />
                            </div>

                            <span className="text-sm text-muted-foreground">Team</span>
                            <p className="">{project.team.teamName} </p>
                            {/* <p>개요:{project.team.description} </p> */}
                            <span className="text-sm text-muted-foreground">Goal</span>
                            <p>{project.team.goal} </p>
                            <div className="">
                              <span className="text-sm text-muted-foreground">Members</span>
                              <div className="flex flex-col gap-2 mt-1">
                                {project.team?.members?.map((member: any) => (
                                  <div className="flex gap-2 items-center">
                                    <div className="">
                                      <Image
                                        className="rounded-full"
                                        src={member.member.image}
                                        alt={member.member.name}
                                        width={36}
                                        height={36}
                                      />
                                    </div>
                                    <div className="">
                                      <p className="font-semibold">{member.member.name}</p>
                                      <p className="text-sm font-medium text-muted-foreground">
                                        {member.member.email}
                                      </p>
                                    </div>

                                    <div className="ml-auto">
                                      <Button className="bg-red-500">Remove</Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="my-2 w-[560px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
                            <span className="text-sm text-muted-foreground">Applicants</span>
                            <div className="flex flex-col gap-2 mt-1">
                              {project.appliedProjects?.length > 0
                                ? project.appliedProjects?.map((application: any) => (
                                    <div
                                      key={application.applicant.id}
                                      className="flex items-center gap-3"
                                    >
                                      <div>
                                        <Image
                                          className="rounded-full"
                                          src={application.applicant.image}
                                          alt={application.applicant.name}
                                          width={36}
                                          height={36}
                                        />
                                      </div>
                                      <div>
                                        <p className="font-semibold">
                                          {" "}
                                          {application.applicant.name}
                                        </p>
                                        <p className="text-sm font-medium text-muted-foreground">
                                          {application.applicant.email}
                                        </p>
                                      </div>

                                      <div className="ml-auto">
                                        {application.applicant.status ===
                                        ApplicationStatus.PENDING ? (
                                          <div className="flex gap-3">
                                            <Button
                                              className="text-xs"
                                              onClick={() =>
                                                _acceptApplication({
                                                  status: ApplicationStatus.ACCEPTED,
                                                  projectId: project.id,
                                                  userName: decodeURIComponent(userName),
                                                  teamId: project.teamId,
                                                  applicantId: application.applicant.id,
                                                  applicantName: application.applicant.name,
                                                })
                                              }
                                            >
                                              Accept
                                            </Button>
                                            <Button
                                              className="text-xs"
                                              onClick={() => {
                                                _rejectApplication({
                                                  status: ApplicationStatus.REJECTED,
                                                  projectId: project.id,
                                                  userName: decodeURIComponent(userName),
                                                  teamId: project.teamId,
                                                  applicantId: application.applicant.id,
                                                  applicantName: application.applicant.name,
                                                });
                                              }}
                                            >
                                              Reject
                                            </Button>
                                          </div>
                                        ) : application.applicant.status ===
                                          ApplicationStatus.ACCEPTED ? (
                                          <span className="text-xs text-xsbg-green-400 px-3 py-2 rounded-md text-white">
                                            Accepted
                                          </span>
                                        ) : (
                                          <span className="text-xs bg-red-400 px-3 py-2 rounded-md text-white">
                                            Rejected
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                : "없음"}
                            </div>
                          </div>
                        </div>
                      ))}
                    {/* // 프로젝트 끝 */}
                  </div>
                </TabsContent>
                <TabsContent value="projectAsMember">
                  <div className="p-2 mt-3">
                    <h3 className="text-xl font-medium mb-2">Ongoing Projects as a Member</h3>
                    <div className="">
                      {projectsAsMember.length > 0 &&
                        projectsAsMember?.map((project: any) => (
                          <div className="flex gap-5 justify-center">
                            <div
                              className="my-2 w-[560px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]"
                              key={project.teamId}
                            >
                              <span className="text-sm text-muted-foreground">Project</span>
                              <div className="flex items-center justify-between">
                                <p>{project.title}</p>
                              </div>

                              <span className="text-sm text-muted-foreground">Team</span>
                              <p className="">{project.team.teamName} </p>
                              {/* <p>개요:{project.team.description} </p> */}
                              <span className="text-sm text-muted-foreground">Goal</span>
                              <p>{project.team.goal} </p>
                              <div className="">
                                <span className="text-sm text-muted-foreground">Members</span>
                                <div className="flex flex-col gap-2 mt-1">
                                  {project.team?.members?.map((member: any) => (
                                    <div className="flex gap-2 items-center">
                                      <div className="">
                                        <Image
                                          className="rounded-full"
                                          src={member.member.image}
                                          alt={member.member.name}
                                          width={36}
                                          height={36}
                                        />
                                      </div>
                                      <div className="">
                                        <p className="font-semibold">{member.member.name}</p>
                                        <p className="text-sm font-medium text-muted-foreground">
                                          {member.member.email}
                                        </p>
                                      </div>
                                      {/* 멤버는 팀 멤버를 제거할 수 없다 */}
                                      {/* <div className="ml-auto">
                                  <Button className="bg-red-500">Remove</Button>
                                </div> */}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="my-2 w-[560px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
                              <span className="text-sm text-muted-foreground">Applicants</span>
                              <div className="flex flex-col gap-2 mt-1">
                                {project.appliedProjects?.length > 0
                                  ? project.appliedProjects?.map((application: any) => (
                                      <div
                                        key={application.applicant.id}
                                        className="flex items-center gap-3"
                                      >
                                        <div>
                                          <Image
                                            className="rounded-full"
                                            src={application.applicant.image}
                                            alt={application.applicant.name}
                                            width={36}
                                            height={36}
                                          />
                                        </div>
                                        <div>
                                          <p className="font-semibold">
                                            {" "}
                                            {application.applicant.name}
                                          </p>
                                          <p className="text-sm font-medium text-muted-foreground">
                                            {application.applicant.email}
                                          </p>
                                        </div>

                                        <div className="ml-auto">
                                          {application.status === ApplicationStatus.PENDING ? (
                                            <span className="text-xs bg-yellow-400 px-3 py-2 rounded-md text-white">
                                              Pending
                                            </span>
                                          ) : application.applicant.status ===
                                            ApplicationStatus.ACCEPTED ? (
                                            <span className="text-xs bg-green-400 px-3 py-2 rounded-md text-white">
                                              Accepted
                                            </span>
                                          ) : (
                                            <span className="text-xs bg-red-400 px-3 py-2 rounded-md text-white">
                                              Rejected
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                  : "없음"}
                              </div>
                            </div>
                          </div>
                        ))}
                      {/* // 프로젝트 끝 */}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            {/* <div className="my-2 w-[500px]">
                <p>프로젝트 지원자</p>
              </div> */}
            {/* </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;
