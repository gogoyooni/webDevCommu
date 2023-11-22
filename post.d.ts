import { User } from "@prisma/client";

export interface Post {
  id: string;
  title: string;
  content: string;
  author: Partial<User, { name: string; email: string; image: string }>;
  createdAt: string;
  comments: Partial<{ id: string }>[];
}
