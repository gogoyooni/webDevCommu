"use client";

import Loader from "@/app/_components/Loader";
import MyPost from "@/app/_components/MyPost";
import NoPost from "@/app/_components/NoPost";
import { useDeletePost, useGetMyPosts } from "@/app/hooks";
import { foramtDate, shareLink } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import { LuThumbsUp, LuMessageSquare, LuBan } from "react-icons/lu";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { LiaShareSolid } from "react-icons/lia";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

const page = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/");
  }

  const { data, error, isLoading } = useGetMyPosts(session?.user?.name as string);

  if (error) return <div>Something went wrong. Please try again later</div>;

  console.log(data);

  const {
    mutate: deletePost,
    isError: deletePostHasError,
    isPending: deletePostIsPending,
  } = useDeletePost();

  interface CommentType {
    id: string;
    content: string;
    motherCommentId: string | null;
    postId: string;
    authorId: string;
    createdAt: string;
  }

  interface LikeType {
    id: string;
    userId: string;
    postId: string;
    commentId: string | null;
  }

  interface PostType {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      email: string;
      image: string;
      githubUserName: string;
      createdAt: string;
    };
    comments: CommentType[];
    likes: LikeType[];
  }

  return (
    // <div className="bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
    <div className="w-full min-h-screen max-h-full pt-6 pb-9">
      {isLoading ? (
        <Loader className="mx-auto w-10 h-10 animate-spin" />
      ) : (
        <div className="mx-auto max-w-6xl">
          <div className="mb-2">
            <h3 className="text-2xl font-semibold">
              My Posts
              <p className="text-sm text-muted-foreground">Posts you wrote</p>
            </h3>
          </div>
          <div className="relative min-h-[200px] my-2 w-[700px]">
            {data?.response?.length > 0 ? (
              data?.response?.map((post: PostType) => (
                <div
                  className="flex gap-3 mb-3 items-center bg-white shadow-md p-3 rounded-lg border-zinc-100 border-[1px]"
                  key={post.id}
                >
                  <div className="text-center">
                    <FaRegThumbsUp className="w-6 h-6" />
                    <span>{post.likes.length}</span>
                  </div>
                  <div>
                    <p className="text-md">{post.title}</p>
                    <div className="flex gap-1 text-sm pb-4">
                      <span className="font-bold">{post.author.name}</span>
                      <span>Posted by {post.author.name}</span>
                      <span>{foramtDate(post.createdAt)}</span>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/posts/${post.id}`}>
                        <div className="flex gap-1 items-center cursor-pointer">
                          <LuMessageSquare className="w-5 h-5" />
                          <span>{post.comments.length}</span>
                        </div>
                      </Link>
                      <div
                        className="flex gap-1 items-center cursor-pointer"
                        onClick={() => shareLink(post.id)}
                      >
                        <LiaShareSolid className="w-5 h-5" />
                        <span>Share</span>
                      </div>
                      <div
                        className="flex gap-1 items-center cursor-pointer"
                        onClick={() => {
                          deletePost(post.id);
                          toast({
                            title: "DELETE",
                            description: `Post '${post.title}' has been deleted`,
                          });
                        }}
                      >
                        <LuBan className="w-5 h-5" />
                        <span>Remove</span>
                      </div>
                    </div>
                  </div>

                  {/* <p>content: {post.content}</p> */}
                </div>
              ))
            ) : (
              <NoPost />
            )}
            {/* <MyPost /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
