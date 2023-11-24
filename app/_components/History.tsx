import { foramtDate } from "@/lib/utils";

import Link from "next/link";

const History = ({ history }: { history: any }) => {
  if (history.notificationType === "LIKE_POST") {
    return (
      <div
        key={history.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          <Link href={`/posts/${history.post.id}`}>you liked {history.post.title}</Link>
        </div>
        <div className="text-sm">{foramtDate(history.createdAt)}</div>
      </div>
    );
  } else if (history.notificationType === "LIKE_COMMENT") {
    return (
      <div
        key={history.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          <Link href={`/posts/${history.comment.postId}`}>
            you liked "{history.comment.content}"
          </Link>
        </div>
        <div className="text-sm">{foramtDate(history.createdAt)}</div>
      </div>
    );
  } else if (history.notificationType === "ACCEPT_INVITATION") {
    return (
      <div
        key={history.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${history.comment.postId}`}> */}
          you accepted an invitation from {history.team?.teamName}
          {/* </Link> */}
        </div>
        <div className="text-sm">{foramtDate(history.createdAt)}</div>
      </div>
    );
  } else if (history.notificationType === "REJECT_INVITATION") {
    return (
      <div
        key={history.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${history.comment.postId}`}> */}
          you rejected an invitation from {history.team?.teamName}
          {/* </Link> */}
        </div>
        <div className="text-sm">{foramtDate(history.createdAt)}</div>
      </div>
    );
  } else if (history.notificationType === "CANCEL_INVITATION") {
    return (
      <div
        key={history.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${history.comment.postId}`}> */}
          you cancelled an invitation to {history.recipientUser.name}
          {/* </Link> */}
        </div>
        <div className="text-sm">{foramtDate(history.createdAt)}</div>
      </div>
    );
  } else if (history.notificationType === "NEW_PROJECT") {
    return (
      <div
        key={history.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${history.comment.postId}`}> */}
          you created a new project of {history.team?.teamName} as Leader
          {/* </Link> */}
        </div>
        <div className="text-sm">{foramtDate(history.createdAt)}</div>
      </div>
    );
  } else if (history.notificationType === "TEAM_DELETED") {
    return (
      <div
        key={history.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${history.comment.postId}`}> */}
          you deleted your team
          {/* </Link> */}
        </div>
        <div className="text-sm">{foramtDate(history.createdAt)}</div>
      </div>
    );
  }
};

export default History;
