"use client";

import Link from "next/link";
// import { useGetPosts } from "./hooks";
import { PostType } from "@/app/types/post";

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

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "./libs/api";

import { useInView } from "react-intersection-observer";

import { useEffect } from "react";
import Backdrop from "./_components/Backdrop";
import Post from "./_components/Post";

export default function Home() {
  const { ref, inView, entry } = useInView();
  let id = 1;

  const { data: session } = useSession();

  const router = useRouter();

  // Mutations

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
        <Backdrop />
      ) : (
        // <Loader className="mx-auto w-10 h-10 animate-spin " />
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
              page?.data?.map((post: PostType) => <Post post={post} />)
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
