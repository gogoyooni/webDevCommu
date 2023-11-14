"use client";

import Link from "next/link";
import { useGetPosts } from "./hooks";
import { Post } from "@/post";
import { User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

export default function Home() {
  const { data, isLoading, error } = useGetPosts();
  const { data: session } = useSession();
  const { toast } = useToast();

  const router = useRouter();

  if (error) {
    return <h3>something is wrong .. try it again later</h3>;
  }
  console.log("session:", session?.user);
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
    } else {
      router.push("/posts/create");
    }
  };

  console.log("data at homepage: ", data);
  return (
    <div>
      <h1>여기가 인덱스 페이지</h1>

      <h3>여기가 게시물들 올라온다</h3>
      <Button onClick={tellUserToLogin} variant={"outline"}>
        Create Post
      </Button>
      {/* <Link
        onClick={tellUserToLogin}
        href={"/posts/create"}
        className="inline-block mt-3 bg-green-300 px-2 py-2 rounded-lg text-white"
      >
        게시글 등록하기
      </Link> */}

      <h3>게시판 목록</h3>

      {isLoading
        ? "Loading..."
        : data?.data?.map((post: Post) => (
            <Card key={post.id} className="w-[350px]">
              <Link href={`/posts/${post.id}`}>
                <CardHeader>
                  <CardTitle>제목: {post.title}</CardTitle>
                  <CardDescription>내용: {post.content}</CardDescription>
                </CardHeader>
                {/* <CardContent></CardContent> */}
                <CardFooter>글쓴이: {post.author.name}</CardFooter>
              </Link>
            </Card>
          ))}
    </div>
  );
}
