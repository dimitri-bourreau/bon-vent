export interface GithubIssue {
  id: number;
  number: number;
  title: string;
  url: string;
  labels: string[];
  state: string;
  createdAt: string;
  updatedAt?: string;
  repositoryFullName: string;
  comments: number;
}
