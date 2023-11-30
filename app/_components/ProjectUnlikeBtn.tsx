import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { LuHeart } from "react-icons/lu";
import { FaHeart } from "react-icons/fa6";
import { unlikeProject } from "../libs/api";

const ProjectUnlikeBtn = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();

  const {
    mutate: _unlikeProject,
    isError: _unlikeProjectHasError,
    isPending: _unlikeProjectIsPending,
  } = useMutation({
    mutationFn: (projectId: string) => unlikeProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <button
      className={`${_unlikeProjectIsPending ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={_unlikeProjectIsPending}
    >
      <FaHeart className="w-5 h-5 text-red-500" onClick={() => _unlikeProject(projectId)} />
    </button>
  );
};

export default ProjectUnlikeBtn;
