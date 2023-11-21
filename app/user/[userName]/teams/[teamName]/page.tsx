"use client";

import { useCreateProject, useGetProjects, useGetUserProjects } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  ChangeEventHandler,
  MutableRefObject,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import { sanitize, isSupported } from "isomorphic-dompurify";
import "react-quill/dist/quill.snow.css";
import { changeStringToArray } from "@/lib/utils";
import Link from "next/link";
import TechStackCreator from "@/app/_components/TechStackCreator";
import Loader from "@/app/_components/Loader";
import { formats, modules } from "@/lib/constants";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <Loader className="w-6 h-6 animate-spin" />,
});

const page = ({
  params,
  searchParams,
}: {
  params: { teamName: string; userName: string };
  searchParams: { userType: string };
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session?.user) {
    router.replace("/");
  }

  const queryString = searchParams.userType;
  const { data, isLoading, error } = useGetUserProjects(
    // paramData,
    params,
    queryString
    // decodeURIComponent(params.teamName)
  );

  const {
    mutate: createProject,
    isError: createProjectHasError,
    isPending: createProjectIsPending,
  } = useCreateProject(params);

  const [projectTitle, setProjectTitle] = useState<string>("");

  const [projectDescByQuill, setProjectDescByQuill] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);

  const onChangeSetTechValue = (e: any) => {
    console.log(e.target?.value);

    if (e.key === "Enter") {
      setTechStack((prev: string[]) => {
        return [...prev, e.target.value];
      });
      setTimeout(() => {
        e.target.value = "";
      }, 500);
    }
  };

  const onChangeSetProject = (e: any) => {
    setProjectTitle(e.target.value);
  };

  return (
    <div className="mx-auto w-[700px]">
      유저이름(리더): {decodeURIComponent(params.userName)}
      <h3>{decodeURIComponent(params.teamName)} 팀의 프로젝트 만들기</h3>
      <span className="text-sm text-muted-foreground">Project name</span>
      <Input
        value={projectTitle}
        onChange={onChangeSetProject}
        className="mb-3"
        type="text"
        name="title"
      />
      <span className="text-sm text-muted-foreground">Libraries</span>
      <TechStackCreator techStack={techStack} onChangeSetTechValue={onChangeSetTechValue} />
      {/* <div className="flex overflow-auto gap-3 mb-3">
        {techStack?.length > 0 &&
          techStack?.map((tech, i) => (
            <span key={i} className="px-3 py-2 rounded-lg bg-green-400">
              {tech}
            </span>
          ))}
      </div>
      <input
        onKeyDown={onChangeSetTechValue}
        className=" relative text-md border border-zinc-400 rounded-md w-[100%] p-2 mb-3"
        type="text"
      /> */}
      <div className="mb-[100px]">
        <span className="text-sm text-muted-foreground">Content</span>
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          style={{ height: "300px", maxHeight: "300px" }}
          // name="description"
          value={projectDescByQuill}
          onChange={setProjectDescByQuill}
        />
      </div>
      <Button
        disabled={createProjectIsPending}
        onClick={() => {
          createProject({
            title: projectTitle,
            content: projectDescByQuill,
            technologies: changeStringToArray(techStack),
            // teamName: decodeURIComponent(params.teamName),
            // userName: decodeURIComponent(params.userName),
          });

          setProjectTitle("");

          toast({
            title: `You created a new project`,
          });

          setTimeout(() => {
            router.push("/");
          }, 1000);
        }}
      >
        Create
      </Button>
      {/* // 해당 팀의 프로젝트 */}
      <h3 className="text-2xl mt-3">프로젝트</h3>
      {searchParams.userType === "LEADER" ? (
        <Suspense fallback={<Loader />}>
          <div className="border border-zinc-400 rounded-md p-2 mt-2">
            <div className="flex text-left border-b-zinc-400 border-b-[1px] mb-3">
              <p className="">이름</p>
            </div>

            {data?.response?.length > 0 &&
              data?.response?.map((project: any) => (
                <div key={project.id} className="flex">
                  <p className="">
                    {/* <Link href={`/user/${decodeURIComponent(session?.user?.name as string)}/team/${project.team.teamName}/${}?userType=LEADER`}>{project.title}</Link> */}
                  </p>
                </div>
              ))}
          </div>
        </Suspense>
      ) : (
        <Suspense fallback={<Loader />}>
          <div className="border border-zinc-400 rounded-md p-2 mt-2">
            <div className="flex text-left border-b-zinc-400 border-b-[1px] mb-3">
              <p className="">이름</p>
            </div>

            {data?.response?.projects?.length > 0 &&
              data?.response?.projects?.map((project: any) => (
                <div key={project.id} className="flex">
                  <p className="">{project.title}</p>
                </div>
              ))}
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default page;
