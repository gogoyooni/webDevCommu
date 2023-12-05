let BASE_URL: string;

if (process.env.NODE_ENV === "production") {
  // Code to run in production mode
  console.log("Running in production mode");

  BASE_URL = "https://web-dev-commu.vercel.app/";
} else {
  // Code to run in development mode
  console.log("Running in development mode");

  BASE_URL = "http://localhost:3000";
}

export async function postComment(data: any) {
  return fetch(`${BASE_URL}/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}
// @ 댓글에 달리는 답글 달기
export async function createAnswer(data: any) {
  return fetch(`${BASE_URL}/api/comments`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export async function getPost(postId: string) {
  return fetch(`${BASE_URL}/api/posts/${postId}`, {
    cache: "no-store",
  }).then((res) => res.json());
}

export async function getPosts(lastCursor: string) {
  return fetch(`${BASE_URL}/api/posts?lastCursor=${lastCursor}`, {
    cache: "no-store",
  }).then((res) => res.json());
}

// 유저가 만든 posts 가져오기
export async function getMyPosts(userName: string) {
  return fetch(`${BASE_URL}/api/user/${userName}/posts`, {
    cache: "no-store",
  }).then((res) => res.json());
}

export async function createPost(data: any) {
  return fetch(`${BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export async function deletePost(postId: string) {
  return fetch(`${BASE_URL}/api/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId }),
  }).then((res) => res.json());
}

// @ 유저가 like 했을 때 변화된 데이터 값 fetching
export async function getPostLikes(data: any) {
  return fetch(`${BASE_URL}/api/posts/userLikePost`, {
    cache: "no-store",
  }).then((res) => res.json());
}

// @ 유저가 like할때 데이터 생성
export async function likePost(data: any) {
  return fetch(`${BASE_URL}/api/likes/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ 유저가 like할때 데이터 생성
export async function unlikePost(data: any) {
  return fetch(`${BASE_URL}/api/likes/post`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ 유저가 comment like 할때 데이터 생성
export async function likeComment(data: any) {
  return fetch(`${BASE_URL}/api/likes/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ 유저가 comment like 취소 - unlike라고 말하겠음
export async function unlikeComment(data: any) {
  return fetch(`${BASE_URL}/api/likes/comment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ 유저가 본인 notification 페이지 이동시

export async function getNotifications(type: string) {
  return fetch(`${BASE_URL}/api/notification?type=${type}`, {
    cache: "no-store",
  }).then((res) => res.json());
}

// @ 유저 팀 만들때

export async function creaetTeam(data: any) {
  return fetch(`${BASE_URL}/api/team`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

//@ 유저가 속한 팀 데이터 가져오기

export async function getTeams() {
  return fetch(`${BASE_URL}/api/team`, {
    cache: "no-store",
  }).then((res) => res.json());
}

//@ 유저가 속한 팀 데이터 가져오기

export async function getInvitations() {
  return fetch(`${BASE_URL}/api/notification`, {
    cache: "no-store",
  }).then((res) => res.json());
}

// @ 유저가 다른 유저에게 초대할때

export async function createInvitation(data: any) {
  return fetch(`${BASE_URL}/api/notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ 초대 수락/거절

export async function respondToInvitation(data: any) {
  // return fetch(`${BASE_URL}/api/invitation/response`, {
  return fetch(`${BASE_URL}/api/notification`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// // @ 초대 취소 as a leader
export async function cancelInvitationAsLeader(data: any) {
  return fetch(`${BASE_URL}/api/notification`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Project -  Get a project for project detailed page
export async function getProject(projectId: string) {
  return fetch(`${BASE_URL}/api/projects/${projectId}`, {
    // return fetch(`${BASE_URL}/api/projects/`, {
    cache: "no-store",
  }).then((res) => res.json());
}

// @ Project - Get all projects
export async function getProjects() {
  return fetch(`${BASE_URL}/api/projects`, {
    cache: "no-store",
  }).then((res) => res.json());
}

// @ Project - Get a user's projects -> 이거 변경
export async function getUserProjects(
  params: { userName: string; teamName: string },
  userType: string
) {
  const { userName, teamName } = params;

  return fetch(`${BASE_URL}/api/user/${userName}/team/${teamName}/projects?userType=${userType}`, {
    cache: "no-store",
  }).then((res) => res.json());
}

export async function getMyProjects(userName: string) {
  return fetch(`${BASE_URL}/api/user/${userName}/projects`, {
    cache: "no-store",
  }).then((res) => res.json());
}

// @ Project - Create: create project
export async function createProject(data: any, params: { userName: string; teamName: string }) {
  const { userName, teamName } = params;
  // return fetch(`${BASE_URL}/api/invitation/response`, {
  return fetch(`${BASE_URL}/api/user/${userName}/team/${teamName}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Project - Update : change the status of project to FINISHED
export async function finishProject(data: any) {
  const { userName, teamName } = data;
  // return fetch(`${BASE_URL}/api/invitation/response`, {
  return fetch(`${BASE_URL}/api/user/${userName}/team/${teamName}/projects`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Project -  Delete :  delete a project
export async function deleteProject(data: any) {
  const { userName, teamName } = data;
  // return fetch(`${BASE_URL}/api/invitation/response`, {
  return fetch(`${BASE_URL}/api/user/${userName}/team/${teamName}/projects`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ ProjectLike - when users like or are interested in a project
export async function likeProject(projectId: string) {
  // const { projectId } = data;
  return fetch(`${BASE_URL}/api/likes/project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectId),
  }).then((res) => res.json());
}
// @ ProjectLike - when users unlike or are not interested in a project
export async function unlikeProject(projectId: string) {
  // const { projectId } = data;
  return fetch(`${BASE_URL}/api/likes/project`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectId),
  }).then((res) => res.json());
}

// @ Project application - apply for a project (create an application as a user)
export async function createApplication(data: any, projectId: string) {
  // const { userName, teamName } = params;
  return fetch(`${BASE_URL}/api/projects/${projectId}/application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Project application - cancel application for a project
export async function cancelApplication(data: any, projectId: string) {
  // const { userName, teamName } = params;
  return fetch(`${BASE_URL}/api/projects/${projectId}/application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Project application - accept an applicant for a proejct (leader만 accept 가능)
export async function acceptApplication(data: any) {
  const { userName, projectId } = data;
  return fetch(`${BASE_URL}/api/user/${userName}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Project application - accept an applicant for a proejct (leader만 reject 가능)
export async function rejectApplication(data: any) {
  const { userName, projectId } = data;
  return fetch(`${BASE_URL}/api/user/${userName}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Bookmark - bookmark a post or project depening on type (post/project)
export async function bookmark(data: any) {
  const { type } = data;
  // return fetch(`${BASE_URL}/api/invitation/response`, {
  return fetch(`${BASE_URL}/api/bookmarks?type=${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Bookmark - bookmark a post or project depening on type (post/project)
export async function unbookmark(data: any) {
  const { type } = data;
  // return fetch(`${BASE_URL}/api/invitation/response`, {
  return fetch(`${BASE_URL}/api/bookmarks?type=${type}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Membership - Quit a team where a user joined (DELETE data of membership)
export async function quitTeam(data: any) {
  const { userName } = data;

  return fetch(`${BASE_URL}/api/user/${userName}/memberships`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @ Team - Delete a Team
export async function deleteTeam(data: any) {
  // const { userName } = data;

  return fetch(`${BASE_URL}/api/team`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

// @Bookmark - get bookmarks initially
export async function getBookmarks(type: string) {
  return fetch(`${BASE_URL}/api/bookmarks?type=${type}`, {
    cache: "no-store",
  }).then((res) => res.json());
}

// // @Bookmark - get bookmarks depending the tab state(post/porject)
// export async function getBookmarks(type: string) {
//   // const { userName } = data;

//   return fetch(`${BASE_URL}/api/bookmarks?type=${type}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     // body: JSON.stringify(data),
//   }).then((res) => res.json());
// }
