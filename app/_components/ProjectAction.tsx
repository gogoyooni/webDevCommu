"use client";

import { Button } from "@/components/ui/button";

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

import { LuStar, LuUserMinus2 } from "react-icons/lu";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { bookmark, deleteProject, finishProject } from "../libs/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { ProjectStatus } from "@prisma/client";

const ProjectAction = ({
  data,
}: {
  data: {
    membership: string;
    userName: string;
    teamName: string;
    teamId: string;
    projectId: string;
    status: string;
  };
}) => {
  const { membership, userName, projectId } = data;

  const queryClient = useQueryClient();
  // Mutations
  const {
    mutate: _finishProject,
    isError: _finishProjectHasError,
    isPending: _finishProjectErrorIsPending,
  } = useMutation({
    mutationFn: (data: any) => finishProject(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast({
        title: "Finished the project",
        description: "You changed the status of project",
      });
    },
  });

  const {
    mutate: _deleteProject,
    isError: _deleteProjectHasError,
    isPending: _deleteProjectErrorIsPending,
  } = useMutation({
    mutationFn: (data: any) => deleteProject(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast({
        title: "Deleted the project",
        description: "You recursively deleted the project",
        variant: "destructive",
      });
    },
  });

  const {
    mutate: _bookmark,
    isError: _bookmarkHasError,
    isPending: _bookmarkIsPending,
  } = useMutation({
    mutationFn: (data: any) => bookmark(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project"] });
      toast({
        title: "Bookmarked",
        description: "You bookmarked the project",
      });
    },
  });

  return (
    <div>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {membership === "LEADER" && (
              <DropdownMenuItem
                onClick={() => _finishProject({ ...data, status: ProjectStatus.FINISHED })}
              >
                Finish
              </DropdownMenuItem>
            )}

            {/* <DropdownMenuItem

            onClick={() =>
              bookmark({
                userName,
                itemId: projectId,
                itemType: ItemType.PROJECT,
              })
            }
            >
               <div className="flex gap-2 items-center">
                <LuStar className="w-4 h-4" />
                <span>Bookmark</span>
              </div>
            </DropdownMenuItem> */}

            {membership === "LEADER" && (
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => _deleteProject({ ...data, status: ProjectStatus.DELETED })}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectAction;
