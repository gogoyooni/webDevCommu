"use client";

import { useCreateApplication, useGetProject } from "@/app/hooks";
import { useSession } from "next-auth/react";

import { sanitize } from "isomorphic-dompurify";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  HtmlHTMLAttributes,
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ApplicationStatus } from "@prisma/client";

const page = ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params;
  const { data, error, isLoading } = useGetProject(projectId);

  const [contentHeight, setContentHeight] = useState<number>();

  const contentRef = useRef(null as null | HTMLDivElement);

  const {
    mutate: applyForProject,
    isError: applyForProjectHasError,
    isPending: applyForProjectIsPending,
  } = useCreateApplication(projectId);

  const { data: session } = useSession(); //유저 로그인 안한 사람은 지원 버튼이 안보이게 해야겠다..

  // useEffect(() => {
  //   // console.log("not mounted")
  //   setTimeout(() => {
  //     if (contentRef.current && contentRef.current.clientHeight) {
  //       // console.log(contentRef.current);
  //       const height = contentRef.current.clientHeight;
  //       setContentHeight(height);
  //     }
  //   }, 6000);
  // }, []);
  // console.log("contentHeight", contentHeight);

  const haveApplied = data?.response?.appliedProjects.filter(
    (project: any) => project.applicant.name === session?.user?.name
  );
  console.log("haveAPplied? :", haveApplied);

  return (
    <div className="w-[1200px] mx-auto py-[100px]">
      <div className="flex justify-center gap-5">
        <div className="">
          {/* <h3> 프로젝트 Id: {params.projectId}</h3> */}
          <div className=" w-[750px]">
            <h2 className="text-2xl">{data?.response?.title}</h2>
            <h3 className="mt-2">글쓴이 겸 프로젝트 리더 : {data?.response?.leader?.name}</h3>
            <p className="flex flex-wrap gap-3 mt-3">
              {data?.response?.techStacks
                ?.map((tech: any) => tech.techStack.technologies)[0]
                .split(",")
                .map((techTag: any, i: number) => (
                  <span key={i} className="text-sm bg-blue-300 p-1 rounded-md">
                    {techTag}
                  </span>
                ))}
            </p>

            <div
              ref={contentRef}
              className="border border-zinc-400 rounded-md p-5 mt-4"
              dangerouslySetInnerHTML={{ __html: sanitize(data?.response.content) }}
            ></div>
          </div>
        </div>
        {/* <div className={`h-[${contentHeight}px] bg-purple-200`}> */}
        <div className="">
          {/* <aside className="w-[340px] h-[350px] ml-5 sticky bg-sky-200 top-[20px] right-7"> */}
          <aside className="w-[340px] border-zinc-300 border-[1px] rounded-md sticky p-3 top-[20px]">
            프로젝트 리더 : <span>프로젝트 리더 아이디- 지금 이 포스트 쓰는 사람..</span>
            프로젝트 인원 : <span>프로젝트 인원 수</span>
            <div className="w-full">
              <h3 className="text-lg">{data?.response?.title}</h3>
              <p className="">👉+👂🏻 {data?.response?.leader?.name}</p>
              {/* // todo 이거 나중에 좀 더 예쁘게 만들자 */}
              <span>🧑🏻‍💻👩🏻‍💻 : {data?.response.team._count.members}</span>
              <div className="flex my-2 items-center [&>*:nth-child(even)]:ml-[-10px]">
                {data?.response.team.members.map((team: any) => (
                  <Image
                    className="rounded-full "
                    alt="team member"
                    src={team.member.image}
                    width={30}
                    height={30}
                  />
                ))}
              </div>
              {/* <p>
                프로젝트 리더 : <span>프로젝트 리더 아이디- 지금 이 포스트 쓰는 사람..</span>
              </p> */}
              {/* <div>
                <p>
                  프로젝트 인원 : <span>프로젝트 인원 수</span>
                </p>
                <div>여기 프로젝트 그룹 인원 맵함수로 리스트 보여주기</div>
              </div> */}
              <Button
                onClick={() =>
                  applyForProject({
                    // applicantId  어차피 api route에서 user 확인하기 떄문에 여기서 안넣어도됨
                    projectId,
                    status: ApplicationStatus.PENDING,
                  })
                }
                //   spinner={true}
                //    label="지원하기"
                //    textSize="md"
                className="bg-blue-500 w-full"
              >
                {/* // To think about : Rejected된 사람은 지원을 못하게 할 것인지 아니면 재지원이 가능하게 할 것인지 */}
                {haveApplied?.length > 0 && haveApplied.status === ApplicationStatus.PENDING
                  ? "Cancel"
                  : "Apply"}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default page;
