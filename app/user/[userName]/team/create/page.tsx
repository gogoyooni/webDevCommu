// import { Team } from "@prisma/client";
import TeamBuilding from "../../../../_components/TeamBuilding";
// import { useCreateTeam } from "../../hooks";

// const BASE_URL = "http://localhost:3000";

const page = () => {
  // const {
  //   mutate: createTeam,
  //   isError: createTeamHasError,
  //   isPending: createTeamIsPending,
  // } = useCreateTeam();

  return (
    <div>
      <h3>Team page 팀 만들기</h3>
      {/* <TeamBuilding createTeam={createTeam} createTeamIsPending={createTeamIsPending} /> */}
      <TeamBuilding />
      {/* {createTeamIsPending ? "Loading..." : } */}
    </div>
  );
};

export default page;
