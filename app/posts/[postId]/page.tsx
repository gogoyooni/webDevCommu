"use client";

import {
  useCreateAnswer,
  useCreateComment,
  useGetPost,
  useLikePost,
  useUnlikePost,
  useUserLikeComment,
  useUserUnlikeComment,
} from "@/app/hooks";

import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";

const Post = ({ params }: { params: { postId: string } }) => {
  const { data: session } = useSession();

  // console.log("유저 이메일:", session?.user?.email);
  const [reply, setReply] = useState("");

  // const [answer, setAnswer] = useState("");
  const [replyInputIsOpen, setReplyInputIsOpen] = useState(false);

  const [userLikedComment, setUserLikedComment] = useState();

  // const onChangeSetAnswer = (e: ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value);
  //   setAnswer(e.target.value);
  // };

  const onChangeSetReply = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
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

  if (postHasError) {
    return <h3>something went wrong. please try it again</h3>;
  }

  if (postIsLoading) {
    return <h3>Loading...</h3>;
  }

  console.log("postData: ", postData);
  console.log("seession User", session?.user?.name);
  const liked = postData?.data?.likes.findIndex(
    (data: any) => data.user.name === session?.user?.name
  );

  console.log("liked: ", liked);

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <h3> Post Id: {params.postId}</h3>
        <Button variant={"outline"}>
          {liked < 0 ? (
            <FaRegThumbsUp
              className="w-[20px] h-[30px]"
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
          ) : (
            <FaThumbsUp
              onClick={() => {
                unlikePost({ postId: params.postId });

                toast({
                  title: `You unliked ${postData?.data?.title} post`,
                  variant: "default",
                });
              }}
              className="w-[20px] h-[30px]"
            />
          )}
        </Button>

        <Card>
          <span>좋아요: {postData?.data?._count.likes}</span>
          <CardHeader>{postData?.data?.title}</CardHeader>
          <CardContent>{postData?.data?.content}</CardContent>
        </Card>
        <div className="flex gap-3">
          <div className="flex gap-2 items-center">
            <Avatar className="w-9 h-9">
              <AvatarImage src={`${session?.user?.image}`} alt={`${session?.user?.name}`} />

              {/* <AvatarFallback>{session?.user?.name}</AvatarFallback> */}
            </Avatar>
            <span>{session?.user?.name}</span>
          </div>
          <div className="flex gap-3">
            <Input onChange={onChangeSetReply} className="w-[400px]" type="text" />
            <Button
              disabled={createCommentIsPending}
              onClick={() => {
                createComment({ postId: params.postId, content: reply });
                setReply("");
              }}
            >
              등록
            </Button>
          </div>
        </div>
        {/* // 댓글 */}
        <div className="flex flex-col">
          {postData?.data?.comments.map((comment: any) => {
            if (comment.motherCommentId === null)
              return (
                <Comment
                  key={comment.id}
                  comment={comment}
                  userLikeComment={userLikeComment}
                  userLikeCommentIsPending={userLikeCommentIsPending}
                  userUnlikeComment={userUnlikeComment}
                  userUnlikeCommentIsPending={userUnlikeCommentIsPending}
                  createComment={createComment}
                  createCommentIsPending={createCommentIsPending}

                  // userLikedComment={userLikedComment}
                  // setUserLikedComment={setUserLikedComment}
                />
              );
          })}
        </div>
      </div>
    </div>
  );
};

export default Post;

const Comment = ({
  comment,
  userLikeComment,
  userLikeCommentIsPending,
  userUnlikeComment,
  userUnlikeCommentIsPending,
  createComment,
  createCommentIsPending,
}: // userLikedComment,
// setUserLikedComment,
{
  comment: any;
  userLikeComment: any;
  userLikeCommentIsPending: any;
  userUnlikeComment: (data: { likeId: string; userId: string; commentId: string }) => void;
  userUnlikeCommentIsPending: boolean;
  // userLikedComment: [] | undefined;
  // setUserLikedComment: Dispatch<SetStateAction<undefined>>;
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

  const onChangeSetAnswer = (e: ChangeEvent<HTMLInputElement>) => {
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

  let commentUserLiked: any = comment?.likes.filter((liked: any) => {
    return liked.commentId === comment.id && liked.user.id === comment.author.id;
  });

  // setUserLikedComment(commentUserLiked);
  // setIsLiked(commentUserLiked);
  console.log("commentUserLiked", commentUserLiked);

  // console.log("isLiked.length:", commentUserLiked.length);
  // console.log("commentUserLiked.id", commentUserLiked.id);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex gap-3 items-center">
          <Avatar className="w-9 h-9">
            <AvatarImage src={comment.author.image} alt={comment.author.name} />
          </Avatar>

          <p>{comment.author.name}</p>
          <p>{comment.content}</p>

          {commentUserLiked?.length < 1 ? (
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
            // unlike할때
            <button
              className={userUnlikeCommentIsPending ? "cursor-not-allowed" : ""}
              disabled={userUnlikeCommentIsPending}
              onClick={() => {
                console.log("commentUserLiked.id", commentUserLiked.id);
                userUnlikeComment({
                  likeId: commentUserLiked[0].id,
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
          )}
        </div>

        <div className="flex bg-zinc-400 gap-3">
          <Input
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
          </Button>
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
      {repliesToComment.length > 0 && (
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
      )}
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
    <div className="flex gap-3 pl-5 items-center">
      <Avatar className="w-9 h-9">
        <AvatarImage src={reply.author.image} alt={reply.author.name} />
      </Avatar>

      <p>{reply.author.name}</p>
      <p>{reply.content}</p>
      <p>{reply.motherCommentId}</p>

      <div className="">
        {/* {reply.author.userLikeComments?.length > 0 &&
          reply.author.userLikeComments.findIndex((like: any) => {
            return like.userId === reply.author.id && like.commentId === reply.id;
          })} */}
        {/* {JSON.stringify(answerUserLiked)} */}
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
      </div>
    </div>
  );
};
