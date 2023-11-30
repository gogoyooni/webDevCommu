interface Applicant {
  id: string;
  applicantId: string;
  projectId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  title: string;
  leader: {
    name: string;
  };
  appliedProjects: Applicant[];
}

export interface BookmarkedProject {
  id: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  project: Project;
}
