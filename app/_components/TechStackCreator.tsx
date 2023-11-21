const TechStackCreator = ({
  techStack,
  onChangeSetTechValue,
}: {
  techStack: string[];
  onChangeSetTechValue: (e: any) => void;
}) => {
  return (
    <>
      <div className="flex overflow-auto gap-3 mb-3">
        {techStack?.length > 0 &&
          techStack?.map((tech: any, i: number) => (
            <span key={i} className="px-3 py-2 rounded-lg bg-green-400">
              {tech}
            </span>
          ))}
      </div>
      <span className="text-sm text-muted-foreground">Add libraries to be used for project</span>
      <input
        placeholder="Type a library or framework to use and press enter"
        onKeyDown={onChangeSetTechValue}
        className=" relative text-md border border-zinc-400 rounded-md w-[100%] p-2 mb-3"
        type="text"
      />
    </>
  );
};

export default TechStackCreator;
