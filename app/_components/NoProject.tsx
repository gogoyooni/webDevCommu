import { LuFolderX } from "react-icons/lu";

const NoProject = () => {
  return (
    <div className="flex gap-2 items-center text-muted-foreground">
      <LuFolderX className="w-6 h-6" />
      <span>No projects to apply for yet</span>
    </div>
  );
};

export default NoProject;
