import Image from "next/image";
import Link from "next/link";

import { foramtDate } from "@/lib/utils";

import TechStack from "./TechStack";
import UnbookmarkBtn from "./UnbookmarkBtn";
import BookmarkBtn from "./BookmarkBtn";
import ProjectLikeBtn from "./ProjectLikeBtn";
import ProjectUnlikeBtn from "./ProjectUnlikeBtn";

const ProjectCard = ({ project }: { project: any }) => {
  return (
    <div
      className="rounded-md border border-zinc-100 bg-white shadow-md p-3 flex flex-col mb-3"
      key={project.id}
    >
      <div className="flex gap-3 items-center">
        <div className="flex flex-col gap-1 text-center">
          {project.isLiked ? (
            <ProjectUnlikeBtn projectId={project.id} />
          ) : (
            <ProjectLikeBtn projectId={project.id} />
          )}
          <span>{project?._count?.projectLikes}</span>
        </div>
        <div>
          <div className="flex items-center text-sm ">
            {/* <span className="font-bold">{post.author.name}</span> */}
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground">Led by {project?.leader?.name}</span>
              <span className="text-sm text-muted-foreground">
                Posted on {foramtDate(project?.createdAt)}
              </span>
            </div>
            {project?.isBookmarked ? (
              <UnbookmarkBtn project={project} />
            ) : (
              <BookmarkBtn project={project} />
            )}
          </div>
          <Link href={`/projects/${project.id}`}>
            <p className="text-md">{project?.title}</p>
            {/* <p className=""> {project?.leader?.name}</p> */}
            {/* // todo 이거 나중에 좀 더 예쁘게 만들자 */}
            {/* <span>🧑🏻‍💻👩🏻‍💻 : {project?.team?._count?.members}</span> */}
            <span className="text-muted-foreground text-xs">Members</span>
            <div className="flex pb-1 items-center [&>*:nth-child(even)]:ml-[-10px]">
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

            <div className="flex flex-wrap gap-3">
              {project?.techStacks
                ?.map((tech: any) => tech.techStack.technologies)[0]
                .split(",")
                .map((techTag: any, i: number) => (
                  <TechStack key={i} techTag={techTag} />
                ))}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
