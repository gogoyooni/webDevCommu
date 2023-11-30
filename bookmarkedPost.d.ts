export interface Post {
  title: string;
  author: {
    name: string;
  };
  likes: {
    id: string;
  }[];
  comments: {
    id: string;
    content: string;
    motherCommentId: string | null;
    postId: string;
    authorId: string;
    createdAt: string;
  }[];
}

export interface BookmarkedPost {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  post: Post;
}
