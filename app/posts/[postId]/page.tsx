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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { foramtDate, shareLink } from "@/lib/utils";
import { LiaShareSolid } from "react-icons/lia";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Loader from "@/app/_components/Loader";

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
        <Loader className="mx-auto w-10 h-10 animate-spin" />
      ) : (
        <div className="mx-auto max-w-3xl">
          <div className="bg-white shadow-md p-3 rounded-lg border-zinc-100 border-[1px]">
            <div className="flex justify-between">
              <div className="flex gap-3">
                <div>
                  {liked < 0 ? (
                    <div className="text-center">
                      <FaRegThumbsUp
                        className="w-5 h-5 cursor-pointer"
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
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaThumbsUp
                        onClick={() => {
                          unlikePost({ postId: params.postId });

                          toast({
                            title: `Unlike Post`,
                            description: `You cancelled liking Post '${postData?.data?.title}'`,
                          });
                        }}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="font-semibold">{postData?.data?._count.likes}</span>
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
                {/* <div
                  onClick={() => {
                    bookmarkItem({
                      itemType: ItemType.POST,
                      itemId: postData?.data?.id,
                    });
                    toast({
                      title: `${postData?.data?.title} is saved`,
                    });
                  }}
                  className="p-2 flex gap-1 items-center text-muted-foreground text-sm rounded-sm hover:bg-slate-200 transition-colors ease-in cursor-pointer"
                >
                  <LuBookmarkPlus className="w-5 h-5" />
                  <span>Save</span>
                </div> */}
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

const Comment = ({
  comment,
  postId,
  postAuthorId,
  userLikeComment,
  userLikeCommentIsPending,
  userUnlikeComment,
  userUnlikeCommentIsPending,
  createComment,
  createCommentIsPending,
}: {
  comment: any;
  postId: string;
  postAuthorId: string;
  userLikeComment: any;
  userLikeCommentIsPending: any;
  userUnlikeComment: (data: { likeId: string; commentId: string }) => void;
  userUnlikeCommentIsPending: boolean;
  createComment: (data: { motherCommentId: string; content: string; postId: string }) => void;
  createCommentIsPending: boolean;
}) => {
  // 댓글에 대한 답글 필터링
  let repliesToComment: any;
  if (comment.motherComment == null) {
    repliesToComment = comment?.replies.filter((reply: any) => {
      return comment.id === reply.motherCommentId;
    });
  }

  const [answer, setAnswer] = useState("");

  const [answerIsClicked, setAnswerIsClicked] = useState(false);

  const onChangeSetAnswer = (e: ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
    setAnswer(e.target.value);
  };
  // const [isLiked, setIsLiked] = useState([]);
  // let commentUserLiked: any = comment?.author?.userLikeComments?.filter((liked: any) => {
  //   return liked.commentId === comment.id && liked.userId === comment.author.id;
  // });

  // console.log("commentUserLiked", commentUserLiked);
  // console.log("comment:", comment.motherCommentId === null);
  // console.log("comment.author.userLikeComments: ", comment.author.userLikeComments);

  // console.log("comment.replies: ", comment.replies);

  const { data: session } = useSession();

  let commentUserLiked: any = comment?.likes.filter((liked: any) => {
    // return liked.commentId === comment.id && liked.user.id === comment.author.id;
    return liked.commentId === comment.id && liked.user.name === session?.user?.name;
  });

  console.log("commentUserLiked", commentUserLiked);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 mt-3">
        <div className="">
          <div className="flex gap-2 items-center">
            <Image
              // className="w-6 h-6"
              className="rounded-full"
              src={comment.author.image}
              alt={comment.author.name}
              width={30}
              height={30}
            />
            <span className="text-xs">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">&bull;</span>
            <span className="text-xs text-muted-foreground">{foramtDate(comment.createdAt)}</span>
          </div>

          <div className="pl-[38px]">
            <div className="text-sm">
              <p>{comment.content}</p>
            </div>
            <div className="flex gap-2 items-center">
              {commentUserLiked?.length < 1 ? (
                <>
                  <FaRegThumbsUp
                    className={`w-4 h-4 text-muted-foreground cursor-pointer  ${
                      userLikeCommentIsPending ? "cursor-not-allowed" : ""
                    }`}
                    disabled={userLikeCommentIsPending}
                    onClick={() => {
                      userLikeComment({
                        userId: comment.author.id,
                        postAuthorId,
                        postId,
                        commentId: comment.id,
                      });

                      toast({
                        title: `You liked ${comment.author.name}'s comment`,
                      });
                    }}
                  />
                  <span>{comment._count.likes}</span>
                </>
              ) : (
                // unlike할때
                // <div className="flex gap-2 items-center">
                <>
                  <FaThumbsUp
                    className={`w-4 h-4 cursor-pointer  ${
                      userUnlikeCommentIsPending ? "cursor-not-allowed" : ""
                    }`}
                    disabled={userUnlikeCommentIsPending}
                    onClick={() => {
                      console.log("commentUserLiked.id", commentUserLiked.id);
                      userUnlikeComment({
                        likeId: commentUserLiked[0].id,
                        // userId: comment.author.id,
                        commentId: comment.id,
                      });

                      toast({
                        title: `You unliked ${comment.author.name}'s comment`,
                        variant: "default",
                      });
                    }}
                  />
                  <span>{comment._count.likes}</span>
                </>
                // </div>
              )}

              {session?.user && (
                <div
                  onClick={() => setAnswerIsClicked(!answerIsClicked)}
                  className="ml-2 flex gap-1 items-center text-muted-foreground cursor-pointer"
                >
                  <LuMessageSquare className="w-5 h-5" />
                  <span className="text-xs font-medium">Reply</span>
                  {/* <span>{postData?.data?.comments?.length}</span> */}
                </div>
              )}
            </div>

            {session?.user && answerIsClicked && (
              <div className="flex gap-3 mt-2">
                <div className="w-full pl-[20px]">
                  {/* <p className="text-xs mb-1">Reply as {session?.user?.name}</p> */}
                  {/* <Avatar className="w-9 h-9">
                <AvatarImage src={`${session?.user?.image}`} alt={`${session?.user?.name}`} />
              </Avatar>
              <span>{session?.user?.name}</span> */}
                  <div className="flex gap-3">
                    <Textarea
                      value={answer}
                      placeholder="What are your thoughts?"
                      onChange={onChangeSetAnswer}
                      className="w-full"
                    />
                    {/* <div className="w-[20px]"></div> */}
                  </div>
                  <div className=" w-full">
                    <div className="h-7 flex justify-end mt-2">
                      <button
                        onClick={() => {
                          createComment({
                            motherCommentId: comment.id,
                            content: answer,
                            postId: comment.postId,
                          });

                          setAnswer("");

                          toast({
                            title: "Successfully commented",
                          });
                        }}
                        className={`text-xs bg-gray-400 font-semibold  rounded-2xl py-1 px-4 ${
                          answer.length > 0
                            ? "!bg-black text-white cursor-pointer"
                            : "text-zinc-300 cursor-not-allowed"
                        }`}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
                {/* <Input
                  value={answer}
                  onChange={onChangeSetAnswer}
                  className="w-[300px]"
                  type="text"
                  placeholder="답글"
                />
                <Button
                  onClick={() => {
                    createComment({
                      motherCommentId: comment.id,
                      content: answer,
                      postId: comment.postId,
                    });

                    setAnswer("");
                  }}
                >
                  답글 등록
                </Button> */}
              </div>
            )}
            {repliesToComment.length > 0 && (
              <div className="flex flex-col gap-3 mt-3">
                {/* <span>답글</span> */}
                {repliesToComment?.map((reply: any) => (
                  <Reply
                    key={reply.id}
                    reply={reply}
                    userLikeComment={userLikeComment}
                    userLikeCommentIsPending={userLikeCommentIsPending}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* {JSON.stringify(commentUserLiked)} */}
        {/* {commentUserLiked.length < 1 ? (
          <button
            className={userLikeCommentIsPending ? "cursor-not-allowed" : ""}
            disabled={userLikeCommentIsPending}
            onClick={() => {
              userLikeComment({
                userId: comment.author.id,
                commentId: comment.id,
              });

              toast({
                title: `You liked ${comment.author.name}'s comment`,
                variant: "default",
              });
            }}
          >
            <FaRegThumbsUp className="w-[20px] h-[30px]" />
          </button>
        ) : (
          <button
            className={userUnlikeCommentIsPending ? "cursor-not-allowed" : ""}
            disabled={userUnlikeCommentIsPending}
            onClick={() => {
              userUnlikeComment({
                userLikeCommentId: commentUserLiked[0].id,
                userId: comment.author.id,
                commentId: comment.id,
              });

              toast({
                title: `You unliked ${comment.author.name}'s comment`,
                variant: "default",
              });
            }}
          >
            <FaThumbsUp className="w-[20px] h-[30px]" />
          </button>
        )} */}
      </div>
      {/* {repliesToComment.length > 0 && (
        <div className="flex flex-col gap-3 bg-sky-200">
          <span>답글</span>
          {repliesToComment?.map((reply: any) => (
            <Reply
              key={reply.id}
              reply={reply}
              userLikeComment={userLikeComment}
              userLikeCommentIsPending={userLikeCommentIsPending}
            />
          ))}
        </div>
      )} */}
    </div>
  );
};

const Reply = ({
  reply,
  userLikeComment,
  userLikeCommentIsPending,
}: // userUnlikeComment
{
  reply: any;
  userLikeComment: any;
  userLikeCommentIsPending: any;
}) => {
  const {
    mutate: userUnlikeComment,
    isError: userUnlikeCommentHasError,
    isPending: userUnlikeCommentIsPending,
  } = useUserUnlikeComment();

  let answerUserLiked: any;

  const [reReply, setRereplyIsClicked] = useState(false);

  // if (reply.author.userLikeComments?.length > 0) {
  //   commentUserLiked = reply.author.userLikeComments.findIndex((like: any) => {
  //     return reply.author.id === like.userId && reply.id === like.commentId;
  //   });
  // }
  console.log("reply::", reply);

  // if (reply.likes?.length > 0) {
  answerUserLiked = reply.likes?.filter((like: any) => {
    return like.user.id === reply.authorId && reply.id === like.commentId;
  });
  // }

  console.log("answerUserLiked", answerUserLiked);

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center">
        <Image
          className="rounded-full"
          src={reply.author.image}
          alt={reply.author.name}
          width={30}
          height={30}
        />

        <span className="text-xs">{reply.author.name}</span>
        <span className="text-xs text-muted-foreground">&bull;</span>
        <span className="text-xs text-muted-foreground">{foramtDate(reply.createdAt)}</span>
      </div>

      <div className="pl-[38px]">
        <div className="text-sm">
          <p>{reply.content}</p>
        </div>
        <div className="flex gap-2 items-center">
          {answerUserLiked?.length < 1 ? (
            <>
              <FaRegThumbsUp
                className={`w-4 h-4 text-muted-foreground cursor-pointer ${
                  userLikeCommentIsPending ? "cursor-not-allowed" : ""
                }`}
                disabled={userLikeCommentIsPending}
                onClick={() => {
                  userLikeComment({
                    userId: reply.authorId,
                    commentId: reply.id,
                    // motherCommnentId: reply.
                  });

                  toast({
                    title: `You liked ${reply.author.name}'s comment`,
                  });
                }}
              />
              <span>{reply._count.likes}</span>
            </>
          ) : (
            // unlike할때
            // <div className="flex gap-2 items-center">
            <>
              <FaThumbsUp
                className={`w-4 h-4 cursor-pointer ${
                  userUnlikeCommentIsPending ? "cursor-not-allowed" : ""
                }`}
                disabled={userUnlikeCommentIsPending}
                onClick={() => {
                  // console.log("commentUserLiked.id", commentUserLiked.id);
                  userUnlikeComment({
                    likeId: answerUserLiked[0].id,
                    userId: reply.authorId,
                    commentId: reply.id,
                  });

                  toast({
                    title: `You unliked ${reply.author.name}'s comment`,
                    variant: "default",
                  });
                }}
              />
              <span>{reply._count.likes}</span>
            </>
            // </div>
          )}
          {/* <div
            onClick={() => setRereplyIsClicked(!reReply)}
            className="ml-2 flex gap-1 items-center text-muted-foreground cursor-pointer"
          >
            <LuMessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">Reply</span>
            
          </div> */}
        </div>

        {/* <div className="">
     
          {answerUserLiked?.length < 1 ? (
            <button
              className={userLikeCommentIsPending ? "cursor-not-allowed" : ""}
              disabled={userLikeCommentIsPending}
              onClick={() =>
                userLikeComment({
                  userId: reply.authorId,
                  commentId: reply.id,
                })
              }
            >
              <FaRegThumbsUp className="w-[20px] h-[30px]" />
            </button>
          ) : (
            <button
              className={userLikeCommentIsPending ? "cursor-not-allowed" : ""}
              disabled={userLikeCommentIsPending}
              onClick={() =>
                userUnlikeComment({
                  likeId: answerUserLiked[0].id,
                  userId: reply.authorId,
                  commentId: reply.id,
                })
              }
            >
              <FaThumbsUp className="w-[20px] h-[30px]" />
            </button>
          )}
        </div> */}
      </div>

      {/* <p>{reply.content}</p>
      <p>{reply.motherCommentId}</p> */}
    </div>
  );
};
