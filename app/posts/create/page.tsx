"use client";

import { useCreatePost } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
// import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Post } from "@/post";
import { useRouter } from "next/navigation";
import { useState } from "react";

const page = () => {
  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  const {
    mutate: createPost,
    isError: createPostHasError,
    isPending: craetePostIsPending,
  } = useCreatePost();

  const onChangeHandler = (e: any) => {
    setPost((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  console.log("post", post);

  const router = useRouter();

  return (
    <div className="mx-auto bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
      <div className="mx-auto max-w-4xl ">
        <h3 className="text-xl font-semibold">Create a post</h3>
        <Separator className="my-3" />
        <div className="flex flex-col gap-3 h-[330px] rounded-md border bg-card text-card-foreground shadow w-full my-2 p-3">
          <div>
            <Input name="title" onChange={onChangeHandler} type="text" placeholder="Title" />
          </div>
          <div>
            <Textarea
              className="h-[200px]"
              name="content"
              onChange={onChangeHandler}
              placeholder="Content"
            />
          </div>
          <div className="flex justify-end">
            <Button
              disabled={craetePostIsPending}
              onClick={() => {
                createPost({ title: post.title, content: post.content });
                setTimeout(() => {
                  router.push("/");
                }, 1000);
              }}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
