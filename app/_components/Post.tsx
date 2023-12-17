import Image from "next/image";
import Link from "next/link";

import { toast } from "@/components/ui/use-toast";

import { foramtDate, shareLink } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { LiaShareSolid } from "react-icons/lia";
import { MdBookmark } from "react-icons/md";
import { LuBookmarkPlus, LuMessageSquare } from "react-icons/lu";

import { bookmark, unbookmark } from "../libs/api";

import { PostType } from "@/app/types/post";

const Post = ({ post }: { post: PostType }) => {
  const queryClient = useQueryClient();

  const {
    mutate: _saveItem,
    isError: _saveItemHasError,
    isPending: _saveItemIsPending,
  } = useMutation({
    mutationFn: bookmark,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast({
        title: "FAIL",
        description: "Bookmarking the post failed",
      });
    },
  });

  const {
    mutate: _unbookmarkItem,
    isError: _unbookmarkItemHasError,
    isPending: _unbookmarkItemIsPending,
  } = useMutation({
    mutationFn: unbookmark,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
    <div
      key={post?.id}
      className="w-full mb-4 rounded-md bg-white shadow-md p-3 border-zinc-100 border-[1px]"
    >
      <div className="flex gap-2 items-center">
        <Image
          className="rounded-full"
          src={post?.author?.image}
          alt={post?.author?.name}
          width={20}
          height={20}
        />
        <span className="text-sm text-muted-foreground">{post?.author?.name}</span>
        <span className="text-sm text-muted-foreground">{foramtDate(post?.createdAt)}</span>
      </div>

      <p className="text-lg mt-1">{post?.title}</p>
      {/* <div className="h-[120px] text-sm mt-2 overflow-hidden bg-gradient-to-b from-transparent from-90% to-zinc-200 "> */}
      <div className="h-[120px] text-sm mt-2 overflow-hidden">{post?.content}</div>

      <div className="flex mt-2">
        <Link href={`/posts/${post?.id}`}>
          <div className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer">
            <LuMessageSquare className="w-5 h-5" />
            <span>{post?.comments?.length} Comments</span>
          </div>
        </Link>
        <div
          onClick={() => shareLink({ postId: post?.id, projectId: null, type: "post" })}
          className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
        >
          <LiaShareSolid className="w-5 h-5" />
          <span>Share</span>
        </div>
        {post.isBookmarked ? (
          <div
            onClick={() => {
              _unbookmarkItem({
                type: "post",
                postId: post.id,
              });
              toast({
                title: "SUCCESS",
                description: `Unbookmarked ${post.title}`,
              });
            }}
            className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
          >
            <MdBookmark className="w-5 h-5" />
            <span>Saved</span>
          </div>
        ) : (
          <div
            onClick={() => {
              _saveItem({
                type: "post",
                postId: post.id,
              });
              toast({
                title: "SUCCESS",
                description: `Bookmarked ${post.title}`,
              });
            }}
            className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
          >
            <LuBookmarkPlus className="w-5 h-5" />
            <span>Save</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
