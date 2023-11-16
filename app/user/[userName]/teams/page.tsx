"use client";

import { useSession } from "next-auth/react";
import { useCraeteInvitation, useGetTeams } from "../../../hooks";
import { Membership, NotificationType, Team } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, Suspense, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TeamBuilding from "@/app/_components/TeamBuilding";

const page = () => {
  const { data, error, isLoading } = useGetTeams();

  const [userEmail, setUserEmail] = useState("");
  const [teamName, setTeamName] = useState("");

  const [creatTeamSectionIsOpen, setCreateTeamSectionIsOpen] = useState(false);

  const {
    data: responseOfSentInvitation,
    mutate: sendInvitation,
    isError: sendInvitationHasError,
    isPending: sendInvitationIsPending,
  } = useCraeteInvitation();

  //   console.log(data);
  const { data: session } = useSession();

  const router = useRouter();

  const onChangeUserEmail = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setUserEmail(e.target.value);
  };

  const onChangeSelectTeam = (teamName: string) => {
    // console.log(e.target.value);
    setTeamName(teamName);
    console.log(teamName);
  };

  //   if (error) return <div>Something is wrong</div>;

  //   {
  //     "userData": {
  //         "id": "clopztl2l0003rpk8e7bny3g5",
  //         "name": "마음부자",
  //         "email": "taeyoondev@gmail.com",
  //         "emailVerified": null,
  //         "image": "https://lh3.googleusercontent.com/a/ACg8ocKtrEesil6oozuiVC-u9Sp_uLYbMij8NGN_swvA2t0y=s96-c",
  //         "createdAt": "2023-11-08T16:47:23.249Z",
  //         "updatedAt": "2023-11-08T16:47:23.249Z",
  //         "membership": [
  //             {
  //                 "id": "cloql7wwv0005rpu7oehsmxvr",
  //                 "userId": "clopztl2l0003rpk8e7bny3g5",
  //                 "teamId": "cloql7wj30003rpu7zo38v7ai",
  //                 "userType": "LEADER",
  //                 "createdAt": "2023-11-09T02:46:23.839Z",
  //                 "member": {
  //                     "id": "clopztl2l0003rpk8e7bny3g5",
  //                     "name": "마음부자",
  //                     "email": "taeyoondev@gmail.com",
  //                     "emailVerified": null,
  //                     "image": "https://lh3.googleusercontent.com/a/ACg8ocKtrEesil6oozuiVC-u9Sp_uLYbMij8NGN_swvA2t0y=s96-c",
  //                     "createdAt": "2023-11-08T16:47:23.249Z",
  //                     "updatedAt": "2023-11-08T16:47:23.249Z"
  //                 },
  //                 "team": {
  //                     "id": "cloql7wj30003rpu7zo38v7ai",
  //                     "leaderId": "clopztl2l0003rpk8e7bny3g5",
  //                     "name": "팀1",
  //                     "image": null,
  //                     "description": "팀1 설명",
  //                     "goal": "10억",
  //                     "memberCount": null,
  //                     "createdAt": "2023-11-09T02:46:23.344Z",
  //                     "updatedAt": "2023-11-09T02:46:23.344Z"
  //                 }
  //             }
  //         ],
  //         "_count": {
  //             "membership": 1
  //         }
  //     }
  // }

  if (!session?.user) {
    alert("로그인을 해주세요");
    router.push("/");
  }

  const teamJoinedAsLeader = data?.userData?.memberships.filter(
    (membership: any) => membership.userType === "LEADER"
  );

  const teamJoinedAsMember = data?.userData?.memberships.filter(
    (membership: any) => membership.userType === "MEMBER"
  );

  // console.log(teamJoinedAsMember);
  console.log("teamJoinedAsLeader", teamJoinedAsLeader);

  return (
    <div>
      <h3>팀 만든거 확인하는 곳</h3>
      {isLoading ? "Loading..." : "로딩완료"}
      {/* <p>{session?.user?.name}의 팀들 입니다.</p> */}

      {/* {data?.userData?.membership.map((team: any) => {
        return team.userType === "LEADER" && <div key={team.team.id}>{team.team.name}</div>;
      })} */}

      <div className="mx-auto w-[500px]">
        <h3 className="text-2xl">팀원 초대</h3>
        <p className="font-bold">현재 {session?.user?.name}님이 리더로 있는 팀들입니다.</p>
        <Suspense fallback={<div>Loading...</div>}>
          {teamJoinedAsLeader?.length > 0 ? (
            <>
              <Select onValueChange={onChangeSelectTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="리더로 있는 팀" />
                </SelectTrigger>
                <SelectContent>
                  {data?.userData?.memberships?.map((membership: any) => {
                    if (membership.userType === "LEADER") {
                      return (
                        //   <div key={membership.teamId}>
                        <SelectItem key={membership.id} value={membership.team.teamName}>
                          {membership.team.teamName}
                        </SelectItem>
                        //   </div>
                      );
                    }
                  })}
                </SelectContent>
              </Select>
              <h3>팀원 초대</h3>
              <Input
                onChange={onChangeUserEmail}
                className="mb-3"
                type="text"
                name="userToInvite"
              />
              {responseOfSentInvitation?.message === "Recipient is not found" && (
                <p className="text-red-500">유저를 찾을 수 없습니다. 정확한 Email을 입력해주세요</p>
              )}
              {responseOfSentInvitation?.message === "INVALID_REQUEST" && (
                <p className="text-red-500">잘못된 요청입니다.</p>
              )}
              {responseOfSentInvitation?.message === "SUCCESS" && (
                <p className="text-green-500">성공적으로 초대를 보냈습니다.</p>
              )}
              <Button
                onClick={() =>
                  sendInvitation({
                    notificationType: NotificationType.PENDING_INVITATION,
                    userEmail,
                    teamName,
                  })
                }
              >
                초대
              </Button>
            </>
          ) : (
            <div>
              <h3>팀을 만들어 프로젝트를 해볼 팀원을 초대해보세요!</h3>
              {/* // todo 아래 팀만들기 버튼을 눌리면 TeamBuilding 컴포넌트가 나오게 만든다. */}
              <Button onClick={() => setCreateTeamSectionIsOpen(!creatTeamSectionIsOpen)}>
                팀 만들기
              </Button>
              <div className="mt-3">{creatTeamSectionIsOpen && <TeamBuilding />}</div>
            </div>
          )}
        </Suspense>
      </div>
      {/* // 유저가 멤버로 있는 팀 시작 */}
      <div className="mx-auto w-[500px] mt-5 border p-3 border-zinc-400 rounded-md">
        {/* // todo 여기 스켈레톤으로 로딩해주자  */}
        <Suspense fallback={<div>Loading...</div>}>
          <h3>내가 멤버로 있는 팀 : {teamJoinedAsMember?.length}</h3>
          {teamJoinedAsMember?.length > 0 ? (
            teamJoinedAsMember.map((membership: any) => (
              <div key={membership.id} className="flex justify-between mt-3 items-center">
                <span
                // href={`/team/${membership.team.teamName}`} // 나중에 이렇게 구현해야됨
                >
                  {membership.team.teamName}
                </span>
                <Link
                  className="bg-slate-950 text-white transition-colors rounded-md text-sm px-3 py-2 hover:bg-zinc-900"
                  // href={`/user/${session?.user?.name}/team/${membership.team.teamName}?userType=MEMBER&teamName=${membership.team.teamName}`}
                  href={`/user/${session?.user?.name}/teams/${membership.team.teamName}?userType=MEMBER`}
                >
                  더 보기
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center">None</div>
          )}
        </Suspense>
      </div>
      {/* // 유저가 멤버로 있는 팀 끝*/}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="mx-auto w-[800px] mt-5 border p-3 border-zinc-400 rounded-md">
          <div>
            {/* {JSON.stringify(data?.userData)} */}
            <h3 className="text-2xl">리더로 있는 팀 : {teamJoinedAsLeader?.length}</h3>
          </div>
          <div className="flex text-left border-b-zinc-400 border-b-[1px] mb-3">
            <p className="w-[30%]">팀</p>
            <p className="w-[50%]">설명</p>
            <p className="w-[20%]">인원</p>
          </div>
          {teamJoinedAsLeader?.length > 0 &&
            teamJoinedAsLeader?.map((org: any) => (
              <div key={org.teamId} className="flex">
                <Link
                  href={`/user/${session?.user?.name}/teams/${org.team.teamName}?userType=LEADER`}
                  className="w-[30%] p-2"
                >
                  {org.team.teamName}
                </Link>
                <p className="w-[50%] p-2">{org.team.description}</p>
                <p className="w-[20%] p-2">{org.team.members.length}</p>
              </div>
            ))}
        </div>
      </Suspense>
    </div>
  );
};

export default page;
