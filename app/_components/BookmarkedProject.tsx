import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foramtDate, shareLink } from "@/lib/utils";
import Link from "next/link";
import { unbookmark } from "../libs/api";
import { toast } from "@/components/ui/use-toast";
import { BookmarkedPost } from "@prisma/client";
import { BookmarkedProject } from "@/bookmarkedProject";
import { LuBan, LuMessageSquare } from "react-icons/lu";
import { LiaShareSolid } from "react-icons/lia";
import { FaRegThumbsUp } from "react-icons/fa";

const BookmarkedProject = ({ project }: { project: BookmarkedProject }) => {
  const queryClient = useQueryClient();
  const {
    mutate: _unbookmarkItem,
    isError: _unbookmarkItemHasError,
    isPending: _unbookmarkItemIsPending,
  } = useMutation({
    mutationFn: unbookmark,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["bookmark"] });
    },
    onError: () => {
      toast({
        title: "FAIL",
        description: "Unbookmarking failed",
        variant: "destructive",
      });
    },
  });
  return (
    <div className="flex gap-3 items-center bg-white p-3 rounded-lg border-zinc-100 border-[1px] hover:border-zinc-200">
      <div className="text-center">
        <FaRegThumbsUp className="w-6 h-6" />
        {/* <span>{project?.project?.likes.length}</span> */}
      </div>
      <div>
        <p className="text-md">{project?.project?.title}</p>
        <div className="flex gap-1 text-sm pb-4">
          <span className="font-bold">{project?.project?.leader.name}</span>
          <span>bookmarked by {project?.project?.leader.name}</span>
          <span>{foramtDate(project?.createdAt)}</span>
        </div>
        <div className="flex">
          {/* <div className="flex gap-1 items-center cursor-pointer"> */}
          <Link
            className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
            href={`/projects/${project?.projectId}`}
          >
            {/* <LuMessageSquare className="w-5 h-5" /> */}
            <span>Applicants</span>
            <span>{project?.project?.appliedProjects.length}</span>
          </Link>
          {/* </div> */}

          <div
            className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
            onClick={() =>
              shareLink({ postId: null, projectId: project?.projectId, type: "project" })
            }
          >
            <LiaShareSolid className="w-5 h-5" />
            <span>Share</span>
          </div>
          <div
            className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
            onClick={() => {
              _unbookmarkItem({
                type: "project",
                projectId: project?.projectId,
              });
              toast({
                title: "SUCCESS",
                description: `${project?.project?.title} deleted in your bookmarks`,
              });
            }}
          >
            <LuBan className="w-5 h-5" />
            <span>Remove</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkedProject;
