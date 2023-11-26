"use client";

import { useSession } from "next-auth/react";
import { useGetInvitations, useRespondToInvitation } from "../hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

// enum responseType {
//   ACCEPTED = "ACCEPTED",
//   REJECTED = "REJECTED",
// }

const Invitation = () => {
  const { data, error, isLoading } = useGetInvitations();

  const { data: session } = useSession();
  const router = useRouter();
  if (!session?.user) {
    // router.back();
    router.push("/");
  }

  const {
    mutate: repspondToInvitation,
    isError: respondToInvitationHasError,
    isPending: respondToInvitationIsPending,
  } = useRespondToInvitation();

  console.log("invitation Data: ", data);

  if (error) return <div>something is wrong</div>;

  if (isLoading) return <div>Loading...</div>;

  //   {
  //     "sentInvitations": [],
  //     "receivedInvitations": [
  //         {
  //             "message": null,
  //             "sender": {
  //                 "id": "clopztl2l0003rpk8e7bny3g5",
  //                 "name": "마음부자",
  //                 "email": "taeyoondev@gmail.com",
  //                 "emailVerified": null,
  //                 "image": "https://lh3.googleusercontent.com/a/ACg8ocKtrEesil6oozuiVC-u9Sp_uLYbMij8NGN_swvA2t0y=s96-c",
  //                 "createdAt": "2023-11-08T16:47:23.249Z",
  //                 "updatedAt": "2023-11-08T16:47:23.249Z"
  //             },
  //             "senderTeam": {
  //                 "id": "cloql7wj30003rpu7zo38v7ai",
  //                 "leaderId": "clopztl2l0003rpk8e7bny3g5",
  //                 "name": "팀1",
  //                 "image": null,
  //                 "description": "팀1 설명",
  //                 "goal": "10억",
  //                 "memberCount": null,
  //                 "createdAt": "2023-11-09T02:46:23.344Z",
  //                 "updatedAt": "2023-11-09T02:46:23.344Z"
  //             }
  //         }
  //     ]
  // }

  return (
    <div>
      <h3>Invitation page</h3>
      {/* {JSON.stringify(data)} */}

      <div className="mx-auto w-[500px] border border-sky-300">
        <h3>내가 초대받은 팀</h3>
        {data?.receivedInvitations?.length === 0 && "없음"}
        {data?.receivedInvitations?.map((sent: any, i: number) => {
          // let data;
          console.log(sent);
          if (sent.status === "PENDING") {
            // console.log("PENDING");
            return (
              <div className="flex items-center justify-between" key={sent.senderId}>
                <p>
                  {sent.sender.name} from {sent.senderTeam.name}
                </p>
                <div className="flex gap-3">
                  <Button
                    disabled={respondToInvitationIsPending}
                    onClick={() => {
                      repspondToInvitation({
                        responseType: "ACCEPTED",
                        senderId: sent.sender.id,
                        senderTeamId: sent.senderTeam.id,
                        // invitationId: sent.inviteNotification?.invitationId,
                      });

                      setTimeout(() => {
                        router.push("/");
                      }, 1500);
                    }}
                    className="bg-green-400"
                  >
                    수락
                  </Button>
                  <Button
                    disabled={respondToInvitationIsPending}
                    onClick={() => {
                      repspondToInvitation({
                        responseType: "REJECTED",
                        senderId: sent.sender.id,
                        senderTeamId: sent.senderTeam.id,
                        // invitationId: sent.inviteNotification?.invitationId,
                      });

                      setTimeout(() => {
                        router.push("/");
                      }, 1500);
                    }}
                    className="bg-red-500"
                  >
                    거절
                  </Button>
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="w-[500px]">
        <h3>내가 초대 보낸 사람</h3>
        {data?.sentInvitations?.length === 0
          ? "없음"
          : data?.sentInvitations?.map((sent: any, i: number) => (
              <div key={sent.receiverId}>
                <p>
                  {sent.receiver.name} as a 리더 from {sent.senderTeam.name}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Invitation;
