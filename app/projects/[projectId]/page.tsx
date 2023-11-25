"use client";

import { useBookmark, useCreateApplication, useGetProject } from "@/app/hooks";
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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelApplication } from "@/app/libs/api";
import { toast } from "@/components/ui/use-toast";
import { foramtDate } from "@/lib/utils";

const page = ({ params }: { params: { projectId: string } }) => {
  const [dateTime, setDateTime] = useState<Date>();
  const { projectId } = params;
  const { data, error, isLoading } = useGetProject(projectId);

  const {
    mutate: applyForProject,
    isError: applyForProjectHasError,
    isPending: applyForProjectIsPending,
  } = useCreateApplication(projectId);

  const queryClient = useQueryClient();
  // Mutations
  const {
    mutate: _cancelApplication,
    isError: _cancelApplicationHasError,
    isPending: _cancelApplicationIsPending,
  } = useMutation({
    mutationFn: (data: any) => cancelApplication(data, projectId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project"] });

      toast({
        title: "Cancelled an application",
        description: "You canceled the application for the project",
      });
    },
  });

  const {
    mutate: bookmark,
    isError: bookmarkHasError,
    isPending: bookmarkIsPending,
  } = useBookmark();

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
  // function foramtDate(date: any) {
  //   const d = new Date(date);
  //   const now = Date.now();
  //   const diff = (now - d.getTime()) / 1000; // 현재 시간과의 차이(초)
  //   if (diff < 60 * 1) {
  //     // 1분 미만일땐 방금 전 표기
  //     return "방금 전";
  //   }
  //   if (diff < 60 * 60 * 24 * 3) {
  //     // 3일 미만일땐 시간차이 출력(몇시간 전, 몇일 전)
  //     return formatDistanceToNow(d, { addSuffix: true, locale: ko });
  //   }
  //   return format(d, "PPP EEE p", { locale: ko }); // 날짜 포맷
  // }

  const haveApplied = data?.response?.appliedProjects?.filter(
    (project: any) => project.applicant.name === session?.user?.name
  );
  console.log("haveAPplied? :", haveApplied);

  return (
    <div className="w-[1200px] mx-auto py-[100px]">
      <div className="flex justify-center gap-5">
        <div className="">
          {/* <h3> 프로젝트 Id: {params.projectId}</h3> */}
          <div className=" w-[750px]">
            <span className="text-sm text-muted-foreground">Project Name</span>
            <h2 className="text-2xl">{data?.response?.title}</h2>
            {/* <span className="text-sm text-muted-foreground">Writer</span> */}
            <div className="flex gap-2 items-center mt-1">
              Led by
              <Image
                key={data?.response?.leader?.id}
                className="rounded-full "
                alt="Leader"
                src={data?.response?.leader?.image}
                width={30}
                height={30}
              />
              <h3 className=""> {data?.response?.leader?.name}</h3>
            </div>

            {/* <span className="text-sm text-muted-foreground">Date</span> */}
            <p className="text-sm mt-2 text-muted-foreground">
              Posted {data?.response?.createdAt && foramtDate(data?.response?.createdAt)}
            </p>
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
              // ref={contentRef}
              className="border border-zinc-400 rounded-md p-5 mt-4"
              dangerouslySetInnerHTML={{ __html: sanitize(data?.response?.content) }}
            ></div>
          </div>
        </div>
        {/* <div className={`h-[${contentHeight}px] bg-purple-200`}> */}
        <div className="">
          {/* <aside className="w-[340px] h-[350px] ml-5 sticky bg-sky-200 top-[20px] right-7"> */}
          <aside className="w-[340px] border-zinc-300 border-[1px] rounded-md sticky p-3 top-[20px]">
            {/* 프로젝트 리더 : <span>프로젝트 리더 아이디- 지금 이 포스트 쓰는 사람..</span>
            프로젝트 인원 : <span>프로젝트 인원 수</span> */}
            <div className="w-full">
              <span className="text-sm text-muted-foreground">Project Name</span>
              <h3 className="text-lg">{data?.response?.title}</h3>
              <span className="text-sm text-muted-foreground">Leader</span>
              <p className="">{data?.response?.leader?.name}</p>
              {/* // todo 이거 나중에 좀 더 예쁘게 만들자 */}
              <span className="text-sm text-muted-foreground">
                Members &#40;{<span>{data?.response?.team?._count?.members}</span>}&#41;
              </span>

              <div className="flex my-2 items-center [&>*:nth-child(even)]:ml-[-10px] [&>*:nth-child(even)]:z-10">
                {data?.response?.team?.members.map((team: any) => (
                  <Image
                    key={team.member.id}
                    className="rounded-full "
                    alt="team member"
                    src={team.member.image}
                    width={30}
                    height={30}
                  />
                ))}
              </div>

              {haveApplied?.length > 0 &&
              haveApplied.find(
                (applicant: any) =>
                  applicant.applicant.name === session?.user?.name && applicant.status === "PENDING"
              ) ? (
                <Button
                  onClick={() =>
                    _cancelApplication({
                      // applicantId  어차피 api route에서 user 확인하기 떄문에 여기서 안넣어도됨
                      projectId,
                      status: ApplicationStatus.CANCELLED,
                    })
                  }
                  className="bg-red-500 w-full hover:bg-red-400"
                >
                  {/* // To think about : Rejected된 사람은 지원을 못하게 할 것인지 아니면 재지원이 가능하게 할 것인지 */}
                  Cancel
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    applyForProject({
                      // applicantId  어차피 api route에서 user 확인하기 떄문에 여기서 안넣어도됨
                      projectId,
                      status: ApplicationStatus.PENDING,
                    })
                  }
                  className="bg-blue-500 w-full"
                >
                  {/* // To think about : Rejected된 사람은 지원을 못하게 할 것인지 아니면 재지원이 가능하게 할 것인지 */}
                  Apply
                </Button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default page;
