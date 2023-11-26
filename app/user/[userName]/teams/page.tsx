"use client";

import { useSession } from "next-auth/react";
import { useCraeteInvitation, useGetTeams } from "../../../hooks";
import { Membership, NotificationType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, Suspense, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRouter } from "next/navigation";
import Link from "next/link";
import TeamBuilding from "@/app/_components/TeamBuilding";
import Loader from "@/app/_components/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelInvitationAsLeader, deleteTeam, quitTeam } from "@/app/libs/api";
import { toast } from "@/components/ui/use-toast";
import Team from "@/app/_components/Team";
import NoTeam from "@/app/_components/NoTeam";

import { LuFlame, LuMail, LuUserX2 } from "react-icons/lu";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

const Teams = () => {
  const { data, error, isLoading } = useGetTeams();

  const [userEmail, setUserEmail] = useState("");
  const [teamName, setTeamName] = useState("");

  const [creatTeamSectionIsOpen, setCreateTeamSectionIsOpen] = useState(false);

  const [invitationTeam, setInvitationTeam] = useState("");

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

  if (!session?.user) {
    alert("로그인을 해주세요");
    router.push("/");
  }

  const queryClient = useQueryClient();
  // Mutations
  const {
    mutate: _quitTeam,
    isError: _quitTeamHasError,
    isPending: _quitTeamIsPending,
  } = useMutation({
    mutationFn: (data: any) => quitTeam(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  const {
    mutate: _deleteTeam,
    isError: _deleteTeamHasError,
    isPending: _deleteTeamIsPending,
  } = useMutation({
    mutationFn: (data: any) => deleteTeam(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  const {
    mutate: _cancelInvitationAsLeader,
    isError: _cancelInvitationAsLeaderHasError,
    isPending: _cancelInvitationAsLeaderIsPending,
  } = useMutation({
    mutationFn: (data: any) => cancelInvitationAsLeader(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  // const teamJoinedAsLeader = data?.userData?.memberships.filter(
  //   (membership: any) => membership.userType === "LEADER"
  // );

  // const teamJoinedAsMember = data?.userData?.memberships.filter(
  //   (membership: any) => membership.userType === "MEMBER"
  // );

  const invitationsToTeam = data?.invitationNotis?.filter(
    (noti: any) => noti?.team?.teamName === invitationTeam
  );

  // console.log(teamJoinedAsMember);
  // console.log("teamJoinedAsLeader", teamJoinedAsLeader);

  return (
    <div className="bg-[#F5F5F5] w-full min-h-screen max-h-full pt-6 pb-9">
      {/* <p>{session?.user?.name}의 팀들 입니다.</p> */}
      {isLoading ? (
        <Loader className="mx-auto w-10 h-10 animate-spin" />
      ) : (
        <>
          <div className="mx-auto max-w-6xl">
            <div className="mb-2">
              <h3 className="text-2xl font-semibold">
                My Teams
                <p className="text-sm text-muted-foreground">Teams You&apos;re In</p>
              </h3>
            </div>
            {/* // 유저가 리더로서 있는 팀 시작 */}
            <div className="flex gap-4">
              <div>
                <p className="font-medium">Team as a Leader</p>
                <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
                  <div className="flex justify-between">
                    {/* <span className="text-sm text-muted-foreground">Team</span> */}
                    {/* <span className="flex gap-1 items-center">
                      <LuFlame className="w-4 h-4 text-red-500" />
                      <span className="text-md">{data?.leadingTeams?.length}</span>
                    </span> */}
                  </div>
                  {data?.leadingTeams?.length === 0 ? (
                    <NoTeam membership="LEADER" />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Name</TableHead>
                          <TableHead className="w-[250px]">Description</TableHead>
                          <TableHead className="w-[200px]">Members</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.leadingTeams?.length > 0 &&
                          data?.leadingTeams?.map((org: any) => (
                            <TableRow key={org.id}>
                              <TableCell className="w-[200px] font-medium">
                                <Link
                                  // href={`/user/${session?.user?.name}/teams/${org.team.teamName}?userType=LEADER`}
                                  href={`/user/${session?.user?.name}/teams/${org.teamName}?userType=LEADER`}
                                  className=""
                                >
                                  {org.teamName}
                                </Link>
                              </TableCell>
                              <TableCell className="w-[200px]">{org.description}</TableCell>
                              <TableCell className="w-[150px] ">
                                <div className="flex items-center [&>*:nth-child(even)]:ml-[-10px]">
                                  {org?.members?.map((member: any) => (
                                    <Image
                                      key={member.member.name}
                                      className="rounded-full"
                                      alt={member.member.name}
                                      src={member.member.image}
                                      width={30}
                                      height={30}
                                    />
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="flex gap-1 items-center">
                                  <LuFlame className="w-4 h-4 text-red-500" />
                                  <span className="text-md">{org?.members?.length}</span>
                                </span>
                              </TableCell>
                              <TableCell className="text-left">
                                <AlertDialog>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                                      >
                                        <DotsHorizontalIcon className="h-4 w-4" />
                                        <span className="sr-only">Open menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px]">
                                      <DropdownMenuItem>
                                        <Link
                                          // href={`/user/${session?.user?.name}/teams/${org.team.teamName}?userType=LEADER`}
                                          href={`/user/${session?.user?.name}/teams/${org.teamName}?userType=LEADER`}
                                        >
                                          Create Project
                                        </Link>
                                      </DropdownMenuItem>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                      </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        your team
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          _deleteTeam({
                                            teamId: org.id,
                                          });
                                          toast({
                                            title: "DELETE",
                                            description: `You deleted ${org.teamName}`,
                                          });
                                        }}
                                      >
                                        Continue
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                {/* <Button
                                  onClick={() => {
                                    _deleteTeam({
                                      teamId: org.id,
                                    });

                                    toast({
                                      title: "DELETE",
                                      description: `You deleted ${org.teamName}`,
                                    });
                                  }}
                                >
                                  Delete
                                </Button> */}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
                {/* // 유저가 리더로서 있는 팀 끝 */}

                {data?.leadingTeams?.length > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <LuMail className="w-5 h-5" />
                      <p className="text-md font-medium">Invitation</p>
                    </div>
                    <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
                      <span className="text-sm text-muted-foreground">
                        Team
                        {/* You need to make your own team before inviting another user to your team. */}
                      </span>
                      <Select onValueChange={onChangeSelectTeam}>
                        <SelectTrigger>
                          <SelectValue placeholder="Your leading teams" />
                        </SelectTrigger>
                        <SelectContent>
                          {data?.leadingTeams?.map((membership: any) => {
                            // if (membership.userType === "LEADER") {
                            return (
                              //   <div key={membership.teamId}>
                              <SelectItem key={membership.id} value={membership.teamName}>
                                {membership.teamName}
                              </SelectItem>
                              //   </div>
                            );
                            // }
                          })}
                        </SelectContent>
                      </Select>
                      {/* <h3>Invite a user to your team</h3> */}
                      <Input
                        placeholder="Type the user's email"
                        onChange={onChangeUserEmail}
                        className="my-3"
                        type="text"
                        name="userToInvite"
                      />
                      {responseOfSentInvitation?.message === "Recipient is not found" && (
                        <p className="text-red-500 my-2">
                          User is not found. Make sure that email is correct.
                        </p>
                      )}
                      {responseOfSentInvitation?.message === "INVALID_REQUEST" && (
                        <p className="text-red-500 my-2">Invalid Request</p>
                      )}
                      {responseOfSentInvitation?.message === "SUCCESS" && (
                        <p className="text-green-500 my-2">
                          Invitation has been sent successfully{" "}
                        </p>
                      )}
                      <div className="flex justify-end">
                        <Button
                          disabled={sendInvitationIsPending}
                          onClick={() =>
                            sendInvitation({
                              notificationType: NotificationType.PENDING_INVITATION,
                              userEmail,
                              teamName,
                            })
                          }
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
                    <p className="font-medium text-md">Team Building</p>
                    <span className="text-sm text-muted-foreground">
                      You need to make your own team before inviting another user to your team
                    </span>
                    {/* <div className="mt-3">{creatTeamSectionIsOpen && <TeamBuilding />}</div> */}
                    <div className="mt-3">
                      <TeamBuilding />
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full">
                <p className="text-md ">Invitation List</p>
                <div className="my-2 h-[300px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
                  <Select onValueChange={(value) => setInvitationTeam(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Team</SelectLabel>
                        {data?.leadingTeams?.length > 0
                          ? data?.leadingTeams?.map((team: any) => (
                              <SelectItem key={team.id} value={team.teamName}>
                                {team.teamName}
                              </SelectItem>
                            ))
                          : "None"}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground my-2">Invitees</p>
                  <div className="overflow-y-auto">
                    {invitationsToTeam?.length === 0 && (
                      <div className="pt-[60px] flex gap-2 items-center justify-center text-muted-foreground">
                        <LuUserX2 className="w-7 h-7" />
                        <p>No invitees yet</p>
                      </div>
                    )}
                    {invitationsToTeam?.length > 0 &&
                      invitationsToTeam?.map((user: any) => (
                        <div key={user.id} className="flex gap-2 justify-between">
                          <div className="flex gap-3 items-center">
                            <Image
                              className="rounded-full"
                              src={user.recipientUser.image}
                              alt={user.recipientUser.name}
                              width={30}
                              height={30}
                            />
                            <div className="flex flex-col text-xs">
                              <span>{user.recipientUser.name}</span>
                              <span>{user.recipientUser.email}</span>
                            </div>
                            <p className="text-yellow-500 ml-3">
                              {user.notificationType === "PENDING_INVITATION" && "PENDING"}
                            </p>
                          </div>
                          <div className="text-xs">
                            <Button
                              disabled={_cancelInvitationAsLeaderIsPending}
                              onClick={() =>
                                _cancelInvitationAsLeader({
                                  notificationId: user.id,
                                  notificationType: NotificationType.CANCEL_INVITATION,
                                })
                              }
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* // 유저가 멤버로 있는 팀 시작 */}
            <div className="mt-3">
              <p className="font-medium">Team as a Member</p>
              <div className="my-2 w-[700px] bg-white shadow-md p-4 rounded-lg border-zinc-100 border-[1px]">
                {/* // todo 여기 스켈레톤으로 로딩해주자  */}

                {/* <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Team</span>
                <span className="flex gap-1 items-center">
                  <LuFlame className="w-4 h-4 text-red-500" />
                  <span className="text-md">{data?.teamsAsMember?.length}</span>
                </span>
              </div> */}
                {data?.teamsAsMember?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead className="w-[250px]">Description</TableHead>
                        <TableHead className="w-[200px]">Members</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {data?.teamsAsMember?.length > 0 &&
                        data?.teamsAsMember?.map((membership: any) => (
                          <TableRow key={membership.id}>
                            <TableCell className="font-medium">
                              {membership.team.teamName}
                            </TableCell>
                            <TableCell>{membership.team.description}</TableCell>
                            <TableCell className="flex items-center [&>*:nth-child(even)]:ml-[-10px]">
                              {membership?.team?.members?.map((member: any) => (
                                <Image
                                  key={member.member.name}
                                  className="rounded-full"
                                  alt={member.member.name}
                                  src={member.member.image}
                                  width={30}
                                  height={30}
                                />
                              ))}
                            </TableCell>
                            <TableCell>
                              <span className="flex gap-1 items-center">
                                <LuFlame className="w-4 h-4 text-red-500" />
                                <span className="text-md">{membership?.team?.members?.length}</span>
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  _quitTeam(data);
                                  toast({
                                    title: "Quit",
                                    description: `You quitted ${membership.team.teamName}`,
                                  });
                                }}
                              >
                                Quit
                              </Button>
                            </TableCell>
                          </TableRow>

                          // <Team
                          //   membership={membership}
                          //   _quitTeam={_quitTeam}
                          //   data={{
                          //     membershipId: membership.id,
                          //     teamName: membership.team.teamName,
                          //     teamId: membership.teamId,
                          //     userName: session?.user?.name,
                          //   }}
                          // />
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <NoTeam membership="MEMBER" />
                )}
              </div>
              {/* // 유저가 멤버로 있는 팀 끝*/}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Teams;
