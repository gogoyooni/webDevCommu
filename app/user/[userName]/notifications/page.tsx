"use client";

import History from "@/app/_components/History";
import Invitation from "@/app/_components/Invitation";
import Loader from "@/app/_components/Loader";
import { useGetNotifications, useRespondToInvitation } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationType } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const page = ({ params }: { params: { userName: string } }) => {
  const [tabValue, setTabValue] = useState("history");
  const { data, error, isLoading } = useGetNotifications(tabValue);

  const { data: session } = useSession();

  console.log("notification data", data);

  if (error) {
    return <div>Something went wrong.. please try it again later</div>;
  }

  // const invitationsUserGot = data?.data?.receivedNotifications?.filter(
  //   (noti: any) =>
  //     noti.notificationType === "PENDING_INVITATION" ||
  //     noti.notificationType === "ACCEPT_INVITATION" ||
  //     noti.notificationType === "REJECT_INVITATION" ||
  //     noti.notificationType === "SEND_INVITATION" // 내가 팀 리더일 때
  // );

  // const invitationsUserSent = data?.data?.sentNotifications?.filter(
  //   (noti: any) =>
  //     noti.notificationType === "PENDING_INVITATION" ||
  //     noti.notificationType === "ACCEPT_INVITATION" ||
  //     noti.notificationType === "REJECT_INVITATION" ||
  //     noti.notificationType === "SEND_INVITATION" // 내가 팀 리더일 때
  // );

  const {
    mutate: repspondToInvitation,
    isError: respondToInvitationHasError,
    isPending: respondToInvitationIsPending,
  } = useRespondToInvitation();

  return (
    <div className="bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
      <div className="mx-auto max-w-6xl">
        <Tabs onValueChange={(val) => setTabValue(val)} defaultValue={tabValue}>
          <TabsList className="w-full rounded-md">
            <div className="w-full gap-2 rounded-md">
              <TabsTrigger className="p-2" value="history">
                History
              </TabsTrigger>
              <TabsTrigger className="p-2" value="invitation">
                Invitation
              </TabsTrigger>
              <TabsTrigger className="p-2" value="application">
                Application
              </TabsTrigger>
              <TabsTrigger className="p-2" value="project">
                Project
              </TabsTrigger>
              <TabsTrigger className="p-2" value="team">
                Team
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="history" className="rounded-md">
            <div className="my-2 w-[700px] bg-white shadow-md p-4 border-zinc-100 border-[1px]">
              {isLoading ? (
                <Loader className="mx-auto w-8 h-8 animate-spin" />
              ) : (
                data?.response?.map((history: any) => {
                  return <History history={history} />;
                })
              )}
            </div>
          </TabsContent>
          <TabsContent value="invitation" className="rounded-md">
            <div className="my-2 w-[700px] bg-white shadow-md p-4 border-zinc-100 border-[1px]">
              {isLoading ? (
                <Loader className="mx-auto w-8 h-8 animate-spin" />
              ) : (
                data?.response?.map((invitation: any) => {
                  return (
                    <Invitation
                      invitation={invitation}
                      respondToInvitation={repspondToInvitation}
                      respondToInvitationHasError={respondToInvitationHasError}
                      respondToInvitationIsPending={respondToInvitationIsPending}
                    />
                  );
                })
              )}
            </div>
          </TabsContent>
          <TabsContent value="application">
            <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
              {/* {isLoading ? (
                <Loader className="mx-auto w-8 h-8 animate-spin" />
              ) : (
                data?.response?.map((post: any) => <div></div>)
              )} */}
            </div>
          </TabsContent>
          <TabsContent value="project">
            <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
              {/* {isLoading ? (
                <Loader className="mx-auto w-8 h-8 animate-spin" />
              ) : (
                data?.response?.map((project: any) => <div></div>)
              )} */}
            </div>
          </TabsContent>
          <TabsContent value="team">
            <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
              {/* {isLoading ? (
                <Loader className="mx-auto w-8 h-8 animate-spin" />
              ) : (
                data?.response?.map((project: any) => <div></div>)
              )} */}
            </div>
          </TabsContent>
        </Tabs>
        {/* {JSON.stringify(data.data)} */}
        {/* {data?.data?.receivedNotifications?.map((noti: any) => (
        <Notification noti={noti} />
      ))} */}
        {/* <ReceivedInvitations data={invitationsUserGot} />
        <SentInvitations data={invitationsUserSent} /> */}
      </div>
    </div>
  );
};

export default page;

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
    <div className="bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
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
