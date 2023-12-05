"use client";

import Link from "next/link";
// import { useGetPosts } from "./hooks";
import { Post } from "@/post";

import { LuMessageSquare, LuBookmarkPlus } from "react-icons/lu";
import { LiaShareSolid } from "react-icons/lia";

import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "./_components/Loader";
import { Input } from "@/components/ui/input";

import Image from "next/image";

import { foramtDate, shareLink } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { bookmark, getPosts, unbookmark } from "./libs/api";
import { MdBookmark } from "react-icons/md";
import LoadMore from "./_components/LoadMore";

import { useInView } from "react-intersection-observer";

import { useEffect, useState } from "react";

export default function Home() {
  // const [nextPage, setNextPage] = useState<number>(0);
  const { ref, inView, entry } = useInView();
  let id = 1;

  const queryClient = useQueryClient();
  // const { data, isLoading, error } = useGetPosts(5);
  const { data: session } = useSession();

  const router = useRouter();

  // Mutations
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

  const {
    data: infiniteData,
    error: infiniteDataHasError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => getPosts(pageParam),
    initialPageParam: "",
    // getNextPageParam: (lastPage, pages) => {
    getNextPageParam: (lastPage) => {
      return lastPage?.metaData?.lastCursor;
    },
    // getNextPageParam: (lastPage, allPages, lastPageParam) => {
    //   console.log("lastPage: ", lastPage, "allPages:", allPages, "lastPageParam:", lastPageParam);
    //   // const nextPage = lastPage.length && allPages.length + 1;
    //   // const nextPage = lastPage.length ? allPages.length + 1 : undefined;
    //   // return nextPage;
    //   return lastPage.length === page ? allPages.length + 1 : undefined;
    // },
  });

  console.log("infiniteData: ", infiniteData);

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["posts", page],
  //   queryFn: () => getPosts(page),
  // });

  useEffect(() => {
    console.log("hasNextPage???", hasNextPage);
    if (inView && hasNextPage) {
      console.log("Load More!!");
      // alert("Load more");
      // console.log("isFetchingNextPage? ", isFetchingNextPage);
      // console.log("hasNextPage? ", hasNextPage);
      // console.log("getNextPageParam:");
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (infiniteDataHasError) {
    return <h3>something is wrong .. try it again later</h3>;
  }

  const tellUserToLogin = () => {
    if (!session?.user?.name) {
      toast({
        title: "Unauthorized",
        description: "You can write a post after login.",
        action: (
          <ToastAction onClick={() => signIn()} altText="Sign in with a Google account">
            Login
          </ToastAction>
        ),
      });
      return;
    } else {
      router.push("/posts/create");
    }
  };

  // console.log("data at homepage: ", data);

  return (
    <div className="mx-auto bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
      {/* {isLoading ? ( */}
      {status === "pending" ? (
        <Loader className="mx-auto w-10 h-10 animate-spin " />
      ) : (
        <div className="mx-auto max-w-2xl">
          {session?.user && (
            <div className="flex items-center p-3 gap-3 rounded-md border bg-card text-card-foreground shadow w-full my-2">
              <Image
                className="rounded-full"
                src={session?.user?.image as string}
                alt={session?.user?.name as string}
                width={30}
                height={30}
              />
              <Input type="text" className="bg-gray-100" onClick={tellUserToLogin} />
            </div>
          )}

          {/* <Button onClick={tellUserToLogin} className="bg-[#2E85D7]">
            Create Post
          </Button> */}
          <div>
            {/* {data?.data?.map((post: Post) => ( */}
            {infiniteData?.pages?.map((page: any) =>
              page?.data?.map((post: Post) => (
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
                    <span className="text-sm text-muted-foreground">
                      {foramtDate(post?.createdAt)}
                    </span>
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
                  {/* <CardContent></CardContent> */}
                </div>
              ))
            )}
          </div>
          {hasNextPage && (
            <div ref={ref}>
              <Loader className="w-8 h-8 animate-spin mx-auto" />
            </div>
          )}
        </div>
      )}

      {/* <Link
        onClick={tellUserToLogin}
        href={"/posts/create"}
        className="inline-block mt-3 bg-green-300 px-2 py-2 rounded-lg text-white"
      >
        게시글 등록하기
      </Link> */}
    </div>
  );
}

//
