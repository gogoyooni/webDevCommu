"use client";

import { useCreatePost } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="mx-auto max-w-[760px]">
      게시물 작성 page
      <div className="flex flex-col gap-3">
        <div>
          <Input name="title" onChange={onChangeHandler} type="text" placeholder="제목" />
        </div>
        <div>
          <Textarea name="content" onChange={onChangeHandler} placeholder="내용을 적어줘" />
        </div>
        <Button
          disabled={craetePostIsPending}
          onClick={() => {
            createPost({ title: post.title, content: post.content });
            setTimeout(() => {
              router.push("/");
            }, 1000);
          }}
          className=""
          variant={"outline"}
          type="submit"
        >
          등록
        </Button>
      </div>
    </div>
  );
};

export default page;
