import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmark } from "../libs/api";
import { toast } from "@/components/ui/use-toast";
import { LuBookmarkPlus } from "react-icons/lu";

const BookmarkBtn = ({ project }: { project: any }) => {
  const queryClient = useQueryClient();

  const {
    mutate: _saveItem,
    isError: _saveItemHasError,
    isPending: _saveItemIsPending,
  } = useMutation({
    mutationFn: bookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast({
        title: "FAIL",
        description: "Bookmarking failed. Try again",
      });
    },
  });
  return (
    <button
      disabled={_saveItemIsPending}
      onClick={() => {
        _saveItem({
          type: "project",
          projectId: project?.id,
        });
        toast({
          title: "SUCCESS",
          description: `Bookmarked ${project.title}`,
        });
      }}
      className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
    >
      <LuBookmarkPlus className="w-5 h-5" />
    </button>
  );
};

export default BookmarkBtn;
