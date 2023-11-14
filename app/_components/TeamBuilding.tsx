"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseMutateFunction } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useCreateTeam } from "../hooks";

interface TeamData {
  name: string;
  description: string;
  goal: string;
}

const TeamBuilding = ({}: // createTeam,
// createTeamIsPending,
{
  // createTeam: UseMutateFunction<any, Error, unknown>;
  // createTeamIsPending: boolean;
}) => {
  const {
    mutate: createTeam,
    isError: createTeamHasError,
    isPending: createTeamIsPending,
  } = useCreateTeam();

  const [teamData, setTeamData] = useState<TeamData>({
    name: "",
    description: "",
    goal: "",
  });

  const onChangeSetTeamData = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    setTeamData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });

    console.log("teamData:", teamData);
  };

  const router = useRouter();

  return (
    <div className="mx-auto w-[500px]">
      <Label htmlFor="name">팀이름</Label>
      <Input onChange={onChangeSetTeamData} type="text" name="name" />
      <Label htmlFor="description">팀 설명</Label>
      <Input onChange={onChangeSetTeamData} type="text" name="description" />
      <Label htmlFor="goal">목표</Label>
      <Input onChange={onChangeSetTeamData} type="text" name="goal" />
      <Button
        disabled={createTeamIsPending}
        onClick={() => {
          createTeam(teamData);
          setTimeout(() => {
            router.push("/team");
          }, 1000);
        }}
        className="w-full mt-5"
      >
        만들기
      </Button>
    </div>
  );
};

export default TeamBuilding;
