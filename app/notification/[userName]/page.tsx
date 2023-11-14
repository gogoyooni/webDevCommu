"use client";

import { useGetNotifications, useRespondToInvitation } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { NotificationType } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const page = ({ params }: { params: { userName: string } }) => {
  const { data, error, isLoading } = useGetNotifications();

  console.log("notification data", data);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    return <div>something went wrong.. please try it again later</div>;
  }

  //   {
  //     "id": "cloon2kav0000rpcpg1pqvrkd",
  //     "name": "마음부자",
  //     "email": "taeyoondev@gmail.com",
  //     "emailVerified": null,
  //     "image": "https://lh3.googleusercontent.com/a/ACg8ocKtrEesil6oozuiVC-u9Sp_uLYbMij8NGN_swvA2t0y=s96-c",
  //     "createdAt": "2023-11-07T18:02:41.095Z",
  //     "updatedAt": "2023-11-07T18:02:41.095Z",
  //     "notifications": [
  //         {
  //             "id": "cloon4f5p0005rpcpwzz5888z",
  //             "type": "LIKEPOST",
  //             "doerId": "cloon3yo30003rpcpiltoyi6j",
  //             "toWhomId": "cloon2kav0000rpcpg1pqvrkd",
  //             "relatedPostId": "cloon3g700002rpcpcok6huzf",
  //             "isRead": false,
  //             "createdAt": "2023-11-07T18:04:07.742Z",
  //             "doerLikedPost": [
  //                 {
  //                     "user": {
  //                         "name": "널리몰",
  //                         "email": "neolimall7@gmail.com"
  //                     },
  //                     "post": {
  //                         "title": "1번째 게시물",
  //                         "author": {
  //                             "name": "마음부자",
  //                             "email": "taeyoondev@gmail.com"
  //                         }
  //                     }
  //                 }
  //             ]
  //         }
  //     ]
  // }

  const invitationsUserGot = data?.data?.receivedNotifications?.filter(
    (noti: any) =>
      noti.notificationType === "PENDING_INVITATION" ||
      noti.notificationType === "ACCEPT_INVITATION" ||
      noti.notificationType === "REJECT_INVITATION" ||
      noti.notificationType === "SEND_INVITATION" // 내가 팀 리더일 때
  );

  const invitationsUserSent = data?.data?.sentNotifications?.filter(
    (noti: any) =>
      noti.notificationType === "PENDING_INVITATION" ||
      noti.notificationType === "ACCEPT_INVITATION" ||
      noti.notificationType === "REJECT_INVITATION" ||
      noti.notificationType === "SEND_INVITATION" // 내가 팀 리더일 때
  );

  console.log("invitationsUserGot", invitationsUserGot);
  console.log("invitationsUserSent", invitationsUserSent);

  return (
    <div>
      <h1> Notification 페이지</h1>
      userName:: {decodeURIComponent(params.userName)}
      <br />
      <br />
      {/* {JSON.stringify(data.data)} */}
      {/* {data?.data?.receivedNotifications?.map((noti: any) => (
        <Notification noti={noti} />
      ))} */}
      <ReceivedInvitations data={invitationsUserGot} />
      <SentInvitations data={invitationsUserSent} />
    </div>
  );
};

export default page;
// [
//   {
//     postId: null,
//     commentId: null,
//     notificationType: "SEND_INVITATION",
//     senderUser: {
//       id: "clos0nwom0001rpze6wa6xfcz",
//       name: "널리몰",
//       email: "neolimall7@gmail.com",
//     },
//     team: {
//       id: "closj2hvp0001rpihetbm8rym",
//       teamName: "팀아무개1",
//       leaderUser: {
//         id: "clos0nwom0001rpze6wa6xfcz",
//         name: "널리몰",
//         email: "neolimall7@gmail.com",
//       },
//     },
//   },
// ];

type SenderUser = {
  id: string;
  name: string;
  email: string;
};
type LeaderUser = {
  id: string;
  name: string;
  email: string;
};

type Team = {
  id: string;
  teamName: string;
  leaderUser: LeaderUser;
};

interface ReceivedInvitation {
  id: string;
  postId: string | null;
  commentId: string | null;
  notificationType: string;
  senderUser: SenderUser;
  team: Team | null;
}
const ReceivedInvitations = ({ data }: { data: ReceivedInvitation[] }) => {
  const {
    mutate: repspondToInvitation,
    isError: respondToInvitationHasError,
    isPending: respondToInvitationIsPending,
  } = useRespondToInvitation();

  const router = useRouter();

  // PENDING notificationType을 하나 넣어주면 팀 초대 보낸 유저의 대시보드나 어디에서나 응답대기중이라는 상태 보게끔 만들 수 있다.
  return (
    <div className="mx-auto w-[500px] border border-zinc-400 p-3 mt-5 rounded-md">
      <h3>내가 초대받은 팀</h3>
      <p>{data?.length === 0 && "현재까지 초대받은 팀 없음"}</p>
      {data?.map((invitation) => (
        <div key={invitation.senderUser.id} className="flex items-center gap-3">
          <p className="text-zinc-600">
            팀 {invitation.team?.teamName}의 {invitation.senderUser.name}님이 팀으로 초대했습니다.
          </p>
          {invitation.notificationType === "ACCEPT_INVITATION" && (
            <span className="rounded-md px-3 py-2 text-green-400 border border-green-400 text-sm">
              수락
            </span>
          )}
          {invitation.notificationType === "REJECT_INVITATION" && (
            <span className="bg-green-400 rounded-md px-3 py-2 text-red-400 border border-red-400 text-sm">
              거절
            </span>
          )}
          {invitation.notificationType === "PENDING_INVITATION" && (
            <>
              <Button
                disabled={respondToInvitationIsPending}
                onClick={() => {
                  repspondToInvitation({
                    notificationId: invitation.id,
                    notificationType: NotificationType.ACCEPT_INVITATION,
                    senderId: invitation.senderUser.id,
                    senderTeamId: invitation?.team?.id,
                  });

                  // setTimeout(() => {
                  //   router.push("/");
                  // }, 1500);
                }}
                className="bg-green-400"
              >
                수락
              </Button>
              <Button
                onClick={() => {
                  repspondToInvitation({
                    notificationId: invitation.id,
                    notificationType: NotificationType.REJECT_INVITATION,
                    senderId: invitation.senderUser.id,
                    senderTeamId: invitation?.team?.id,
                  });

                  // setTimeout(() => {
                  //   router.push("/");
                  // }, 1500);
                }}
                className="bg-red-400"
              >
                거절
              </Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const SentInvitations = ({ data }: { data: any }) => {
  const {
    mutate: repspondToInvitation,
    isError: respondToInvitationHasError,
    isPending: respondToInvitationIsPending,
  } = useRespondToInvitation();

  const router = useRouter();

  // PENDING notificationType을 하나 넣어주면 팀 초대 보낸 유저의 대시보드나 어디에서나 응답대기중이라는 상태 보게끔 만들 수 있다.
  return (
    <div className="mx-auto w-[500px] border border-zinc-400 p-3 mt-5 rounded-md">
      <h3>내가 초대한 사용자</h3>
      <p>{data?.length === 0 && "현재까지 초대한 유저 없음"}</p>
      {data?.map((invitation: any) => (
        <div key={invitation.senderUser.id} className="flex items-center gap-3">
          <p className="text-zinc-600">
            {invitation.recipientUser.name}님을 {invitation.team?.teamName} 팀으로 초대했습니다.
          </p>
          {invitation.notificationType === "ACCEPT_INVITATION" && (
            <span className="bg-green-400 rounded-md px-3 py-2 text-green-400 border border-green-400 text-sm">
              수락
            </span>
          )}
          {invitation.notificationType === "REJECT_INVITATION" && (
            <span className="bg-red-400 rounded-md px-3 py-2 text-red-400 border border-red-400 text-sm">
              거절
            </span>
          )}
          {invitation.notificationType === "PENDING_INVITATION" && (
            <p className="border border-zinc-400 px-3 py-2 rounded-md">응답 대기중</p>
          )}
        </div>
      ))}
    </div>
  );
};

// const Notification = ({ noti }: { noti: any }) => {
//   let message: ReactNode;
//   // if (noti?.notificationType === "LIKE_POST") {
//   //   message = (
//   //     <div>
//   //       <Link href={`/posts/${noti?.relatedPostId}`}>
//   //         {noti?.doerLikedPost?.map((doer: any) => (
//   //           <p>{doer?.user?.name}이 당신의 게시물을 좋아합니다.</p>
//   //         ))}
//   //       </Link>
//   //     </div>
//   //   );
//   // }
//   console.log("noti::::::::::::", noti);
//   return (
//     <div>
//       <p>{message}</p>
//     </div>
//   );
// };
