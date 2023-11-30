import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegHeart } from "react-icons/fa6";
import { likeProject } from "../libs/api";

const ProjectLikeBtn = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();

  const {
    mutate: _likeProject,
    isError: _likeProjectHasError,
    isPending: _likeProjectIsPending,
  } = useMutation({
    mutationFn: (projectId: string) => likeProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return (
    <button
      className={`${_likeProjectIsPending ? "cursor-not-allowed" : "cursor-pointer"}`}
      disabled={_likeProjectIsPending}
    >
      <FaRegHeart className="w-5 h-5" onClick={() => _likeProject(projectId)} />
    </button>
  );
};

export default ProjectLikeBtn;
