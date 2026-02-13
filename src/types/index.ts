export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
}

export interface CommitWeek {
  days: number[];
}

export interface GithubReposResponse {
  repos: GithubRepo[];
}
