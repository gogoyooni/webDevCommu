"use client";

import { useSession } from "next-auth/react";
import { useGetProjects } from "../hooks";
import Image from "next/image";
import Link from "next/link";

const page = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return <div>Plase log in first</div>;
  }

  const { data, error, isLoading } = useGetProjects();

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-[#F5F5F5] w-screen h-screen">
          <h3>프로젝트 리스트 페이지</h3>

          <div className="mx-auto w-[500px]  ">
            {data?.response?.length > 0 &&
              data?.response?.map((project: any) => (
                <div
                  className=" rounded-md border border-zinc-100 bg-white shadow-md p-3 flex flex-col mb-3"
                  key={project.id}
                >
                  <Link href={`/projects/${project.id}`}>
                    <h3 className="text-lg">{project?.title}</h3>
                    <p className="">👉+👂🏻 {project?.leader?.name}</p>
                    {/* // todo 이거 나중에 좀 더 예쁘게 만들자 */}
                    <span>🧑🏻‍💻👩🏻‍💻 : {project?.team?._count?.members}</span>
                    <div className="flex my-2 items-center [&>*:nth-child(even)]:ml-[-10px]">
                      {project.team.members.map((team: any) => (
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
                          <span key={i} className="text-sm bg-blue-300 p-1 rounded-md">
                            {techTag}
                          </span>
                        ))}
                    </p>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
