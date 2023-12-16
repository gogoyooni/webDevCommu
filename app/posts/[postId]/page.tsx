"use client";

import {
  useBookmark,
  useCreateAnswer,
  useCreateComment,
  useGetPost,
  useLikePost,
  useUnlikePost,
  useUserLikeComment,
  useUserUnlikeComment,
} from "@/app/hooks";

import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { LuMessageSquare, LuBookmarkPlus } from "react-icons/lu";

import { ChangeEvent, useState } from "react";
import { useSession } from "next-auth/react";

import { toast } from "@/components/ui/use-toast";
import { foramtDate, shareLink } from "@/lib/utils";
import { LiaShareSolid } from "react-icons/lia";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/app/_components/Loader";
import Comment from "@/app/_components/Comment";
import Backdrop from "@/app/_components/Backdrop";

const Post = ({ params }: { params: { postId: string } }) => {
  const { data: session } = useSession();

  const [reply, setReply] = useState("");

  // const [answer, setAnswer] = useState("");
  const [replyInputIsOpen, setReplyInputIsOpen] = useState(false);

  const [userLikedComment, setUserLikedComment] = useState();

  const onChangeSetReply = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // console.log(e.target.value);
    setReply(e.target.value);
  };

  const [userLiked, setUserLiked] = useState(false);
  const {
    data: postData,
    error: postHasError,
    isLoading: postIsLoading,
  } = useGetPost(params.postId);

  const {
    data: userLikePostData,
    mutate: likePostData,
    isError: likePostHasError,
    isPending: likePostIsPending,
  } = useLikePost();

  // console.log("유저 클릭한 후에 데이터 값 userLikePostData :::", userLikePostData);

  const {
    mutate: createComment,
    isError: commentHasError,
    isPending: createCommentIsPending,
  } = useCreateComment();

  const {
    mutate: createAnswer,
    isError: createAnswerHasError,
    isPending: createAnswerIsPending,
  } = useCreateAnswer();

  // console.log(data);

  const {
    // data,
    mutate: unlikePost,
    isError: unlikePostHasError,
    isPending: unlikePostIsPending,
  } = useUnlikePost();

  const {
    mutate: userLikeComment,
    isError: userLikeCommentHasError,
    isPending: userLikeCommentIsPending,
  } = useUserLikeComment();

  const {
    mutate: userUnlikeComment,
    isError: userUnlikeCommentHasError,
    isPending: userUnlikeCommentIsPending,
  } = useUserUnlikeComment();

  const {
    mutate: bookmarkItem,
    isError: bookmarkItemHasError,
    isPending: bookmarkIsPending,
  } = useBookmark();

  if (postHasError) {
    return <h3>something went wrong. please try it again</h3>;
  }

  // if (postIsLoading) {
  //   return <h3>Loading...</h3>;
  // }

  console.log("postData: ", postData);
  console.log("seession User", session?.user?.name);
  const liked = postData?.data?.likes.findIndex(
    (data: any) => data.user.name === session?.user?.name
  );

  console.log("liked: ", liked);

  return (
    <div className="bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
      {postIsLoading ? (
        <Backdrop />
      ) : (
        // <Loader className="mx-auto w-10 h-10 animate-spin" />
        <div className="mx-auto max-w-3xl">
          <div className="bg-white shadow-md p-3 rounded-lg border-zinc-100 border-[1px]">
            <div className="flex justify-between">
              <div className="flex gap-3">
                <div>
                  {liked < 0 ? (
                    <div className="relative text-center">
                      <button
                        className={`${likePostIsPending ? "cursor-not-allowed" : "cursor-pointer"}`}
                        disabled={likePostIsPending}
                      >
                        <FaRegThumbsUp
                          className="w-5 h-5"
                          onClick={() => {
                            likePostData({
                              postId: params.postId,
                              toWhomId: postData?.data?.authorId,
                              // toWhomId: postData?.data?.author.name,
                            });
                            toast({
                              title: `You liked ${postData?.data?.title} post`,
                              variant: "default",
                            });
                          }}
                        />
                        <span className="font-semibold">{postData?.data?._count.likes}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        className={`${
                          unlikePostIsPending ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                        disabled={unlikePostIsPending}
                      >
                        <FaThumbsUp
                          onClick={() => {
                            unlikePost({ postId: params.postId });

                            toast({
                              title: `Unlike Post`,
                              description: `You unliked '${postData?.data?.title}'`,
                            });
                          }}
                          className="w-5 h-5"
                        />
                        <span className="font-semibold">{postData?.data?._count.likes}</span>
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex gap-2 text-sm">
                    <span className="text-xs text-muted-foreground">
                      Posted by {postData?.data?.author?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {foramtDate(postData?.data?.createdAt)}
                    </span>
                  </div>
                  <p className="text-md font-medium py-1">{postData?.data?.title}</p>
                  <p className="text-xs">{postData?.data?.content}</p>
                </div>
              </div>
              {/* <div className="cursor-pointer">
              <LuBookmarkPlus className="w-5 h-5" />
            </div> */}
            </div>
            <div className="flex gap-3 mt-2">
              <div className="w-[20px]"></div>
              <div className="flex gap-2 items-center">
                <div className="flex gap-1 items-center">
                  <LuMessageSquare className="w-5 h-5" />
                  <span>{postData?.data?.comments?.length}</span>
                </div>

                <div
                  className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
                  onClick={() => shareLink(postData?.data?.id)}
                >
                  <LiaShareSolid className="w-5 h-5" />
                  <span>Share</span>
                </div>
                <div
                  onClick={() => {
                    shareLink({
                      postId: postData?.data?.id,
                      projectId: null,
                      type: "post",
                    });
                    toast({
                      title: `Bookmarked ${postData?.data?.title} `,
                    });
                  }}
                  className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
                >
                  <LuBookmarkPlus className="w-5 h-5" />
                  <span>Save</span>
                </div>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="flex gap-3 px-[12px]">
              {/* <div className="w-[20px]"></div> */}
              <div className="w-full px-[12px]">
                {session?.user && (
                  <>
                    <p className="text-xs mb-1">Comment as {session?.user?.name}</p>

                    <div className="flex gap-3">
                      <Textarea value={reply} onChange={onChangeSetReply} className="w-full" />
                      {/* <div className="w-[20px]"></div> */}
                    </div>
                    <div className=" w-full">
                      <div className="h-7 flex justify-end mt-2">
                        <button
                          onClick={() => {
                            createComment({ postId: postData?.data?.id, content: reply });

                            setReply("");

                            toast({
                              title: "Successfully commented",
                            });
                          }}
                          className={`text-xs bg-gray-400 font-semibold  rounded-2xl py-1 px-4 ${
                            reply.length > 0
                              ? "!bg-black text-white cursor-pointer"
                              : "text-zinc-300 cursor-not-allowed"
                          }`}
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* // 댓글 */}
                <div className="flex flex-col">
                  {postData?.data?.comments.map((comment: any) => {
                    if (comment.motherCommentId === null)
                      return (
                        <Comment
                          key={comment.id}
                          postId={params.postId}
                          postAuthorId={postData?.data?.authorId}
                          comment={comment}
                          userLikeComment={userLikeComment}
                          userLikeCommentIsPending={userLikeCommentIsPending}
                          userUnlikeComment={userUnlikeComment}
                          userUnlikeCommentIsPending={userUnlikeCommentIsPending}
                          createComment={createComment}
                          createCommentIsPending={createCommentIsPending}
                        />
                      );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
