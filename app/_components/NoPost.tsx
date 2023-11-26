import { LuPenSquare } from "react-icons/lu";

const NoPost = () => {
  return (
    <div className="absolute top-[40%] left-[50%] translate-x-[-50%] trasnlate-y-[-40%] flex gap-2 items-center ">
      <LuPenSquare className="w-7 h-7 text-muted-foreground" />
      <span className="text-md text-muted-foreground text-">
        It&apos;s time to leave some marks!
      </span>
    </div>
  );
};

export default NoPost;
