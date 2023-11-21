import { LuShip, LuNavigation } from "react-icons/lu";

const NoTeam = ({ membership }: { membership: string }) => {
  return (
    <div className="flex justify-center items-center gap-2 p-8">
      {membership === "LEADER" ? (
        <LuNavigation className="w-7 h-7 text-muted-foreground" />
      ) : (
        <LuShip className="w-7 h-7 text-muted-foreground" />
      )}
      <span className="text-md text-muted-foreground">
        {membership === "LEADER" ? "No team to lead yet" : "No team to sail with yet"}
      </span>
    </div>
  );
};

export default NoTeam;
