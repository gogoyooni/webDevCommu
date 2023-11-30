import { BookmarkedPost } from "@/bookmarkedPost";
import { FaRegThumbsUp } from "react-icons/fa";
import { LiaShareSolid } from "react-icons/lia";
import Link from "next/link";
import { LuBan, LuMessageSquare } from "react-icons/lu";
import { foramtDate, shareLink } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unbookmark } from "../libs/api";
import { toast } from "@/components/ui/use-toast";

const BookmarkedPost = ({ post }: { post: BookmarkedPost }) => {
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
        <span>{post?.post?.likes.length}</span>
      </div>
      <div>
        <p className="text-md">{post?.post?.title}</p>
        <div className="flex gap-1 text-sm pb-4">
          <span className="font-bold">{post?.post?.author.name}</span>
          <span>bookmarked by {post?.post?.author.name}</span>
          <span>{foramtDate(post?.createdAt)}</span>
        </div>
        <div className="flex">
          {/* <div className="flex gap-1 items-center cursor-pointer"> */}
          <Link
            className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
            href={`/posts/${post?.postId}`}
          >
            <LuMessageSquare className="w-5 h-5" />
            <span>{post?.post?.comments.length}</span>
          </Link>
          {/* </div> */}

          <div
            className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
            onClick={() => shareLink({ postId: post?.postId, projectId: null, type: "post" })}
          >
            <LiaShareSolid className="w-5 h-5" />
            <span>Share</span>
          </div>
          <div
            className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
            onClick={() => {
              _unbookmarkItem({
                type: "post",
                postId: post?.postId,
              });
              toast({
                title: "SUCCESS",
                description: `${post?.post?.title} deleted in your bookmarks`,
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

export default BookmarkedPost;
