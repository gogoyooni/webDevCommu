import { toast } from "@/components/ui/use-toast";
import { MdBookmark } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unbookmark } from "../libs/api";

const UnbookmarkBtn = ({ project }: { project: any }) => {
  const queryClient = useQueryClient();
  const {
    mutate: _unbookmarkItem,
    isError: _unbookmarkItemHasError,
    isPending: _unbookmarkItemIsPending,
  } = useMutation({
    mutationFn: unbookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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
    <button
      disabled={_unbookmarkItemIsPending}
      onClick={() => {
        _unbookmarkItem({
          type: "project",
          projectId: project?.id,
        });
        toast({
          title: "SUCCESS",
          description: `Unbookmarked ${project?.title}`,
        });
      }}
      className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
    >
      <MdBookmark className="w-5 h-5" />
    </button>
  );
};

export default UnbookmarkBtn;
