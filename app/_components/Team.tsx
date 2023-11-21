import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Team = ({
  membership,
  _quitTeam,
  data,
}: {
  membership: any;
  _quitTeam: (data: any) => void;
  data: any;
}) => {
  return (
    <div key={membership.id} className="flex justify-between mt-3 items-center">
      <span
      // href={`/team/${membership.team.teamName}`} // 나중에 이렇게 구현해야됨
      >
        {membership.team.teamName}
      </span>
      {/* <Link
    className="bg-slate-950 text-white transition-colors rounded-md text-sm px-3 py-2 hover:bg-zinc-900"
    href={`/user/${session?.user?.name}/teams/${membership.team.teamName}?userType=MEMBER`}
  >
    더 보기
  </Link> */}

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
    </div>
  );
};

export default Team;
