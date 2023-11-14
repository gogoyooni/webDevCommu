"use client";

import { useGetMyProjects } from "@/app/hooks";
import { acceptApplication } from "@/app/libs/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ApplicationStatus } from "@prisma/client";
import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

const Projects = ({ params }: { params: { userName: string } }) => {
  const { userName } = params;

  const { data, error, isLoading } = useGetMyProjects(userName);

  if (error) return <div>Something is wrong. Try again later</div>;

  //   const {} = useAcceptApplication();

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

  const projectsAsLeader = data?.response?.filter(
    (project: any) => project?.team?.leaderUser?.name === decodeURIComponent(userName)
  );
  const projectsAsMember = data?.response?.filter(
    (project: any) => project?.team?.leaderUser?.name !== decodeURIComponent(userName)
  );

  console.log("project as leader:", projectsAsLeader);

  console.log("project as member: ", projectsAsMember);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h3>{`/user/${decodeURIComponent(userName)}/projects`}</h3>
          <div className="mx-auto w-[600px]">
            <div>
              <h3>리더로 있는 프로젝트</h3>
              <div>
                {projectsAsLeader?.map((project: any) => (
                  <div>
                    <div className="my-2" key={project.teamId}>
                      <p>팀이름:{project.team.teamName} </p>
                      <p>개요:{project.team.description} </p>
                      <p>goal: {project.team.goal} </p>
                      <div>
                        <p>members: </p>
                        {project.team?.members?.map((member: any) => (
                          <div className="flex gap-2 items-center">
                            <Image
                              className="rounded-full"
                              src={member.member.image}
                              alt={member.member.name}
                              width={30}
                              height={30}
                            />
                            <p>name: {member.member.name}</p>
                            <p>email: {member.member.email}</p>
                            <p>github: {member.member.githubUserName}</p>
                          </div>
                        ))}
                      </div>
                      <div className="my-2">
                        <p>프로젝트 지원자</p>
                        <div>
                          {project.appliedProjects?.length > 0
                            ? project.appliedProjects?.map((application: any) => (
                                <div
                                  key={application.applicant.id}
                                  className="flex items-center gap-3"
                                >
                                  <Image
                                    className="rounded-full"
                                    src={application.applicant.image}
                                    alt={application.applicant.name}
                                    width={30}
                                    height={30}
                                  />
                                  <p> 이름: {application.applicant.name}</p>

                                  <p>github: {application.applicant.githubUserName}</p>
                                  <div className="flex gap-3">
                                    {application.applicant.status === ApplicationStatus.PENDING ? (
                                      <>
                                        <Button
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
                                      </>
                                    ) : application.applicant.status ===
                                      ApplicationStatus.ACCEPTED ? (
                                      <span className="bg-green-400 px-3 py-2 rounded-md text-white">
                                        Accepted
                                      </span>
                                    ) : (
                                      <span className="bg-red-400 px-3 py-2 rounded-md text-white">
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
                    <div className="my-2" key={project.id}>
                      <p>프로젝트</p>
                      이름:{project.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="my-2">
              <h3>멤버로 있는 프로젝트</h3>
              <div>
                {projectsAsMember?.map((project: any) => (
                  <div>
                    <div className="my-2" key={project.teamId}>
                      <p>팀이름:{project.team.teamName} </p>
                      <p>개요:{project.team.description} </p>
                      <p>goal: {project.team.goal} </p>
                      <div className="my-2">
                        <p>members: </p>
                        {project.team?.members?.map((member: any) => (
                          <div className="flex gap-2 items-center">
                            <Image
                              className="rounded-full"
                              src={member.member.image}
                              alt={member.member.name}
                              width={30}
                              height={30}
                            />
                            <p>name: {member.member.name}</p>
                            <p>email: {member.member.email}</p>
                            <p>github: {member.member.githubUserName}</p>
                          </div>
                        ))}
                      </div>
                      <div className="my-2">
                        <p>프로젝트 지원자</p>
                        <div>
                          {project.appliedProjects?.length > 0
                            ? project.appliedProjects?.map((application: any) => (
                                <div key={application.applicant.id}>
                                  <Image
                                    className="rounded-full"
                                    src={application.applicant.image}
                                    alt={application.applicant.name}
                                    width={30}
                                    height={30}
                                  />
                                  <p> 이름: {application.applicant.name}</p>

                                  <p>github: {application.applicant.githubUserName}</p>
                                  <div className="flex gap-3">
                                    <Button
                                      onClick={() =>
                                        _acceptApplication({
                                          status: ApplicationStatus.ACCEPTED,
                                          projectId: project.id,
                                          teamId: project.teamId,
                                          applicantId: application.applicant.id,
                                          applicantName: application.applicant.name,
                                        })
                                      }
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        _rejectApplication({
                                          status: ApplicationStatus.REJECTED,
                                          projectId: project.id,
                                          teamId: project.teamId,
                                          applicantId: application.applicant.id,
                                          applicantName: application.applicant.name,
                                        })
                                      }
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              ))
                            : "없음"}
                        </div>
                      </div>
                    </div>
                    <div className="my-2" key={project.id}>
                      <p>프로젝트</p>
                      이름:{project.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;
