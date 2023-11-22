"use client";

import Link from "next/link";
import { useGetPosts } from "./hooks";
import { Post } from "@/post";
import { ItemType, User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LuMessageSquare, LuBookmarkPlus } from "react-icons/lu";
import { LiaShareSolid } from "react-icons/lia";

import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Loader from "./_components/Loader";
import { Input } from "@/components/ui/input";

import Image from "next/image";
// import { format, formatDistanceToNow } from "date-fns";
// import ko from "date-fns/locale/ko";
import { foramtDate, shareLink } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmark } from "./libs/api";

export default function Home() {
  const { data, isLoading, error } = useGetPosts();
  const { data: session } = useSession();

  const router = useRouter();

  if (error) {
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

  const queryClient = useQueryClient();
  // Mutations
  const {
    mutate: _saveItem,
    isError: _saveItemHasError,
    isPending: _saveItemIsPending,
  } = useMutation({
    mutationFn: bookmark,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["bookmark"] });
    },
  });

  return (
    <div className="mx-auto bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
      {isLoading ? (
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
            {data?.data?.map((post: Post) => (
              <div
                key={post.id}
                className="w-full mb-4 rounded-md bg-white shadow-md p-3 border-zinc-100 border-[1px]"
              >
                <div className="flex gap-2 items-center">
                  <Image
                    className="rounded-full"
                    src={post.author.image}
                    alt={post.author.name}
                    width={20}
                    height={20}
                  />
                  <span className="text-sm text-muted-foreground">{post.author.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {foramtDate(post.createdAt)}
                  </span>
                </div>

                <p className="text-lg mt-1">{post.title}</p>
                <div className="h-[120px] text-sm mt-2 overflow-hidden bg-gradient-to-b from-transparent from-90% to-zinc-200 ">
                  {post.content}
                </div>

                <div className="flex gap-2 mt-2">
                  <Link href={`/posts/${post.id}`}>
                    <div className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer">
                      <LuMessageSquare className="w-4 h-4" />
                      <span>{post.comments.length} Comments</span>
                    </div>
                  </Link>
                  <div
                    onClick={() => shareLink(post.id)}
                    className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
                  >
                    <LiaShareSolid className="w-4 h-4" />
                    <span>Share</span>
                  </div>
                  <div
                    onClick={() => {
                      _saveItem({
                        itemType: ItemType.POST,
                        itemId: post.id,
                      });
                      toast({
                        title: `${post.title} is saved`,
                      });
                    }}
                    className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
                  >
                    <LuBookmarkPlus className="w-4 h-4" />
                    <span>Save</span>
                  </div>
                </div>
                {/* <CardContent></CardContent> */}
              </div>
            ))}
          </div>
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
