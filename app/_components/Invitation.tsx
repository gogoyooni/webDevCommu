"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import { foramtDate } from "@/lib/utils";

import { NotificationType } from "@prisma/client";

import { useRespondToInvitation } from "../hooks";

const Invitation = ({
  invitation,
  respondToInvitation,
  respondToInvitationHasError,
  respondToInvitationIsPending,
}: {
  invitation: any;
  respondToInvitation: any;
  respondToInvitationHasError: any;
  respondToInvitationIsPending: any;
}) => {
  if (respondToInvitationHasError) return <div>Something went wrong. Please try again later</div>;
  if (invitation.notificationType === "PENDING_INVITATION") {
    return (
      <div
        key={invitation.id}
        className="flex items-center justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${history.comment.postId}`}> */}
          {invitation.team?.teamName} is waiting for your response
          {/* </Link> */}
        </div>
        <div>
          <Button
            disabled={respondToInvitationIsPending}
            onClick={() => {
              respondToInvitation({
                notificationId: invitation.id,
                notificationType: NotificationType.ACCEPT_INVITATION,
                senderId: invitation.senderUserId,
                senderTeamId: invitation?.teamId,
              });

              toast({
                title: `You accepted ${invitation.team?.teamName}'s invitation`,
              });

              // setTimeout(() => {
              //   router.push("/");
              // }, 1500);
            }}
            variant="secondary"
            // className="bg-green-400"
          >
            Accept
          </Button>
          <Button
            onClick={() => {
              respondToInvitation({
                notificationId: invitation.id,
                notificationType: NotificationType.REJECT_INVITATION,
                senderId: invitation.senderUserId,
                senderTeamId: invitation?.teamId,
              });

              toast({
                title: `You declined ${invitation.team?.teamName}'s invitation`,
              });
              // setTimeout(() => {
              //   router.push("/");
              // }, 1500);
            }}
            className="bg-red-400"
          >
            Decline
          </Button>
        </div>
        <div className="text-sm">{foramtDate(invitation.createdAt)}</div>
      </div>
    );
  } else if (invitation.notificationType === "LIKE_COMMENT") {
    return (
      <div
        key={invitation.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          <Link href={`/posts/${invitation.comment.postId}`}>
            you liked "{invitation.comment.content}"
          </Link>
        </div>
        <div className="text-sm">{foramtDate(invitation.createdAt)}</div>
      </div>
    );
  } else if (invitation.notificationType === "ACCEPT_INVITATION") {
    return (
      <div
        key={invitation.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${invitation.comment.postId}`}> */}
          you accepted an invitation from {invitation.team?.teamName}
          {/* </Link> */}
        </div>
        <div className="text-sm">{foramtDate(invitation.createdAt)}</div>
      </div>
    );
  } else if (invitation.notificationType === "REJECT_INVITATION") {
    return (
      <div
        key={invitation.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${invitation.comment.postId}`}> */}
          you rejected an invitation from {invitation.team?.teamName}
          {/* </Link> */}
        </div>
        <div className="text-sm">{foramtDate(invitation.createdAt)}</div>
      </div>
    );
  } else if (invitation.notificationType === "CANCEL_INVITATION") {
    return (
      <div
        key={invitation.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${invitation.comment.postId}`}> */}
          you cancelled an invitation to {invitation.recipientUser.name}
          {/* </Link> */}
        </div>
        <div className="text-sm">{foramtDate(invitation.createdAt)}</div>
      </div>
    );
  } else if (invitation.notificationType === "NEW_PROJECT") {
    return (
      <div
        key={invitation.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${invitation.comment.postId}`}> */}
          you created a new project of {invitation.team?.teamName} as Leader
          {/* </Link> */}
        </div>
        <div>{foramtDate(invitation.createdAt)}</div>
      </div>
    );
  } else if (invitation.notificationType === "TEAM_DELETED") {
    return (
      <div
        key={invitation.id}
        className="flex justify-between border-b-[1px] border-zinc-300 p-3 hover:bg-slate-200 transition-colors ease-in"
      >
        <div>
          {/* <Link href={`/posts/${invitation.comment.postId}`}> */}
          you deleted your team
          {/* </Link> */}
        </div>
        <div className="text-sm">{foramtDate(invitation.createdAt)}</div>
      </div>
    );
  }
};

export default Invitation;
