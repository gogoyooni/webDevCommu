"use client";

import { useCreateProject, useGetProjects, useGetUserProjects } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ChangeEvent, ChangeEventHandler, Suspense, useState } from "react";

import { sanitize, isSupported } from "isomorphic-dompurify";

import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { changeStringToArray } from "@/lib/utils";
import Link from "next/link";

const QuillWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

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

  const [projectData, setProjectData] = useState({
    title: "",
    // description: "",
  });

  const [projectDescByQuill, setProjectDescByQuill] = useState("");

  const [techStack, setTechStack] = useState<string[]>([]);
  const [techValue, setTechValue] = useState("");

  // console.log(projectDescByQuill);

  const onChangeSetTechValue = (e: any) => {
    // console.log(e.target.value);
    console.log(e.target?.value);
    // setTechValue(e.target.value);
    if (e.key === "Enter") {
      setTechStack((prev: string[]) => {
        return [...prev, e.target.value];
      });
      setTimeout(() => {
        e.target.value = "";
      }, 500);
    }
  };
  console.log("techStack: ", techStack);

  const onChangeSetProject = (e: any) => {
    // console.log(e.target.value);
    setProjectData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  // console.log("project data: ", data);
  // console.log("cleaned version :", sanitize(projectDescByQuill));

  return (
    <div className="mx-auto w-[700px]">
      유저이름(리더): {decodeURIComponent(params.userName)}
      <h3>{decodeURIComponent(params.teamName)} 팀의 프로젝트 만들기</h3>
      <Input
        value={projectData.title}
        onChange={onChangeSetProject}
        className="mb-3"
        type="text"
        name="title"
      />
      <div className="flex overflow-auto gap-3 mb-3">
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
      />
      {/* <Textarea
        value={projectData.description}
        onChange={onChangeSetProject}
        className="mb-3"
        name="description"
      /> */}
      <div className="mb-[100px]">
        <QuillWrapper
          theme="snow"
          modules={modules}
          formats={formats}
          style={{ height: "300px", maxHeight: "300px" }}
          // name="description"
          value={projectDescByQuill}
          onChange={setProjectDescByQuill}
          // getHTML
          // value={value} onChange={setValue}
        />
      </div>
      <Button
        disabled={createProjectIsPending}
        onClick={() => {
          createProject({
            title: projectData.title,
            content: projectDescByQuill,
            technologies: changeStringToArray(techStack),
            // teamName: decodeURIComponent(params.teamName),
            // userName: decodeURIComponent(params.userName),
          });

          setProjectData({
            title: "",
            // description: "",
          });

          toast({
            title: `You created a new project`,
            // variant: "default",
          });

          setTimeout(() => {
            router.push("/");
          }, 1000);

          // setTimeout(() => {
          //   router.refresh();
          // }, 1000);
        }}
      >
        등록
      </Button>
      {/* // 해당 팀의 프로젝트 */}
      <h3 className="text-2xl mt-3">프로젝트</h3>
      {searchParams.userType === "LEADER" ? (
        <Suspense fallback={<div>Loading...</div>}>
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
        <Suspense fallback={<div>Loading...</div>}>
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
