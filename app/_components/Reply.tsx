import { useState } from "react";
import { useUserUnlikeComment } from "../hooks";
import Image from "next/image";
import { foramtDate } from "@/lib/utils";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { toast } from "@/components/ui/use-toast";

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
            <button
              className={`flex gap-2 items-center ${
                userLikeCommentIsPending ? "cursor-not-allowed" : ""
              }`}
              disabled={userLikeCommentIsPending}
            >
              <FaRegThumbsUp
                className="w-4 h-4 text-muted-foreground cursor-pointer"
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
            </button>
          ) : (
            // unlike할때
            // <div className="flex gap-2 items-center">
            <button
              className={`flex gap-2 items-center ${
                userUnlikeCommentIsPending ? "cursor-not-allowed" : ""
              }`}
            >
              <FaThumbsUp
                className="w-4 h-4 cursor-pointer"
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
            </button>
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

export default Reply;
