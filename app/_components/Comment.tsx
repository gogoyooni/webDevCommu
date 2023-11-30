import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { foramtDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";
import Reply from "./Reply";

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
                <button
                  className={`flex gap-2 items-center ${
                    userLikeCommentIsPending ? "cursor-not-allowed" : ""
                  }`}
                  disabled={userLikeCommentIsPending}
                >
                  <FaRegThumbsUp
                    className={`w-4 h-4 text-muted-foreground cursor-pointer ${
                      userLikeCommentIsPending ? "cursor-not-allowed" : ""
                    }`}
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
                </button>
              ) : (
                // unlike할때
                <button className="flex gap-2 items-center" disabled={userUnlikeCommentIsPending}>
                  <FaThumbsUp
                    className={`w-4 h-4 cursor-pointer ${
                      userUnlikeCommentIsPending ? "cursor-not-allowed" : ""
                    }`}
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
                </button>
              )}

              {session?.user && (
                <div
                  onClick={() => setAnswerIsClicked(!answerIsClicked)}
                  className="ml-2 flex gap-1 items-center text-muted-foreground cursor-pointer"
                >
                  <LuMessageSquare className="w-5 h-5" />
                  <span className="text-xs font-medium">Reply</span>
                </div>
              )}
            </div>

            {session?.user && answerIsClicked && (
              <div className="flex gap-3 mt-2">
                <div className="w-full pl-[20px]">
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
      </div>
    </div>
  );
};

export default Comment;
