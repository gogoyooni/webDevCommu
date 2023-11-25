import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  acceptApplication,
  bookmark,
  creaetTeam,
  createAnswer,
  createApplication,
  createInvitation,
  createPost,
  createProject,
  deletePost,
  getInvitations,
  getMyPosts,
  getMyProjects,
  getNotifications,
  getPost,
  getPosts,
  getProject,
  getProjects,
  getTeams,
  getUserProjects,
  likeComment,
  likePost,
  postComment,
  rejectApplication,
  respondToInvitation,
  unlikeComment,
  unlikePost,
} from "./libs/api";
import { Post } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";

export const useGetPost = (postId: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["post"],
    queryFn: () => getPost(postId),
  });

  return {
    data,
    error,
    isLoading,
  };
};

export const useGetPosts = () => {
  const { data, error, isLoading } = useQuery({ queryKey: ["posts"], queryFn: getPosts });

  return {
    data,
    error,
    isLoading,
  };
};
// @ GET - Get user's posts
export const useGetMyPosts = (userName: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getMyPosts(userName),
  });

  return {
    data,
    error,
    isLoading,
  };
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  // Mutations
  const { mutate, isError, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    mutate,
    isError,
    isPending,
  };
};

type useDeletePostMutationDataType = {
  id: string;
};

export function useDeletePost() {
  const queryClient = useQueryClient();
  // Mutations
  const { mutate, isError, isPending } = useMutation({
    // mutationFn: (data: useDeletePostMutationDataType) => deletePost(data),
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    mutate,
    isError,
    isPending,
  };
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  // Mutations
  const { mutate, isError, isPending } = useMutation({
    mutationFn: (data: object) => postComment(data),
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  return {
    mutate,
    isError,
    isPending,
  };
};
// @ comment - user likes a comment
export const useUserLikeComment = () => {
  const queryClient = useQueryClient();

  // Mutations
  const { mutate, isError, isPending } = useMutation({
    mutationFn: (data: object) => likeComment(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  return {
    mutate,
    isError,
    isPending,
  };
};

// @ comment - user unlikes a comment
export const useUserUnlikeComment = () => {
  const queryClient = useQueryClient();

  // Mutations
  const { mutate, isError, isPending } = useMutation({
    mutationFn: (data: object) => unlikeComment(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["post"] });
      // toast
    },
    // onError: () => {
    //   toast({
    //     title: "Unlike a comment",
    //     description: "Something went wrong witht the action of unliking the comment",
    //     variant: "destructive",
    //   });
    // },
  });

  return {
    mutate,
    isError,
    isPending,
  };
};

// export const useGetComments = () => {
//   const { data, error, isLoading } = useQuery({ queryKey: ["comments"], queryFn: getComments });

//   return {
//     data,
//     error,
//     isLoading,
//   };
// };

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  // Mutations
  const { mutate, isError, isPending } = useMutation({
    mutationFn: createAnswer,
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  return {
    mutate,
    isError,
    isPending,
  };
};

// export const useGetLikePost = () => {
//   const { data, error, isLoading } = useQuery({ queryKey: ["post"], queryFn: getPost });

//   return {
//     data,
//     error,
//     isLoading,
//   };
// };

// export const useLikePost = (postId: string) => {
export const useLikePost = () => {
  const queryClient = useQueryClient();
  // Mutations
  const { data, mutate, isError, isPending } = useMutation({
    mutationFn: (postId: any) => likePost(postId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  return {
    data,
    mutate,
    isError,
    isPending,
  };
};

// @ DELETE - delete userLikePost
export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  // Mutations
  const { data, mutate, isError, isPending } = useMutation({
    mutationFn: (data: { postId: string }) => unlikePost(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });

  return {
    data,
    mutate,
    isError,
    isPending,
  };
};

// @ notification GET - get notifications for a user
export const useGetNotifications = (tabValue: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["notifications", tabValue],
    queryFn: () => getNotifications(tabValue),
  });

  return {
    data,
    error,
    isLoading,
  };
};

// @ POST - Create team
export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  // Mutations
  const { data, mutate, isError, isPending } = useMutation({
    mutationFn: (data: any) => creaetTeam(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  return {
    data,
    mutate,
    isError,
    isPending,
  };
};
// @ GET - Get teams
export const useGetTeams = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: getTeams,
  });

  return {
    data,
    error,
    isLoading,
  };
};

// @ GET - Get invitations
export const useGetInvitations = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["invitation"],
    queryFn: getInvitations,
  });

  return {
    data,
    error,
    isLoading,
  };
};

// @ POST - Create an invitation (send an invitation to another user)
export const useCraeteInvitation = () => {
  const queryClient = useQueryClient();
  // Mutations
  const { data, mutate, isError, isPending } = useMutation({
    mutationFn: (data: any) => createInvitation(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });

  return {
    data,
    mutate,
    isError,
    isPending,
  };
};

// @ POST - Accept / Reject an invitation
export const useRespondToInvitation = () => {
  const queryClient = useQueryClient();
  // Mutations
  const { data, mutate, isError, isPending } = useMutation({
    mutationFn: (data: any) => respondToInvitation(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    data,
    mutate,
    isError,
    isPending,
  };
};

// interface QueryString {
//   userType: string;
//   teamName: string;
// }

// @ GET - Get a project
export const useGetProject = (projectId: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["project"],
    queryFn: () => getProject(projectId),
  });

  return {
    data,
    error,
    isLoading,
  };
};

// @ GET - Get Projects
export const useGetProjects = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["project"],
    queryFn: getProjects,
  });

  return {
    data,
    error,
    isLoading,
  };
};

// @ GET - Get user's projects
export const useGetUserProjects = (
  params: { userName: string; teamName: string },
  userType: string
) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["project"],
    queryFn: () => getUserProjects(params, userType),
  });

  return {
    data,
    error,
    isLoading,
  };
};

// @ GET - Get user's projects(of team as a leader / as a member)
export const useGetMyProjects = (userName: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["project"],
    queryFn: () => getMyProjects(userName),
  });

  return {
    data,
    error,
    isLoading,
  };
};

// @ POST - Create Project
export const useCreateProject = (params: { userName: string; teamName: string }) => {
  const queryClient = useQueryClient();
  // Mutations
  const { data, mutate, isError, isPending } = useMutation({
    mutationFn: (data: any) => createProject(data, params),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });

  return {
    data,
    mutate,
    isError,
    isPending,
  };
};

// @ POST - Create an application for a project

export const useCreateApplication = (projectId: string) => {
  const queryClient = useQueryClient();
  // Mutations
  const { data, mutate, isError, isPending } = useMutation({
    mutationFn: (data: any) => createApplication(data, projectId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });

  return {
    data,
    mutate,
    isError,
    isPending,
  };
};

// @ DELETE - Cancel application for a proejct

export const useCancelApplication = (projectId: string) => {
  const queryClient = useQueryClient();
  // Mutations
  const { data, mutate, isError, isPending } = useMutation({
    mutationFn: (data: any) => createApplication(data, projectId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });

  return {
    data,
    mutate,
    isError,
    isPending,
  };
};

// @ POST - Project application : accept an applicant for a proejct (leader만 accept 가능)
// export const useAcceptApplication = (projectId: string) => {
//   const queryClient = useQueryClient();
//   // Mutations
//   const { data, mutate, isError, isPending } = useMutation({
//     mutationFn: (data: any) => acceptApplication(data, projectId),
//     onSuccess: () => {
//       // Invalidate and refetch
//       queryClient.invalidateQueries({ queryKey: ["project"] });
//     },
//   });

//   return {
//     data,
//     mutate,
//     isError,
//     isPending,
//   };
// };

// @ POST - Project application : accept an applicant for a proejct (leader만 accept 가능)
// export const useRejectApplication = (projectId: string) => {
//   const queryClient = useQueryClient();
//   // Mutations
//   const { data, mutate, isError, isPending } = useMutation({
//     mutationFn: (data: any) => rejectApplication(data, projectId),
//     onSuccess: () => {
//       // Invalidate and refetch
//       queryClient.invalidateQueries({ queryKey: ["project"] });
//     },
//   });

//   return {
//     data,
//     mutate,
//     isError,
//     isPending,
//   };
// };

// @ Project application - accept an applicant for a proejct (leader만 reject 가능)

export const useBookmark = () => {
  const queryClient = useQueryClient();
  // Mutations
  const { mutate, isError, isPending } = useMutation({
    mutationFn: bookmark,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["bookmark"] });
    },
  });
  return {
    mutate,
    isError,
    isPending,
  };
};
