export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  homepage: string | null;
  license: string | null;
  default_branch: string;
}

export interface CommitWeek {
  days: number[];
}

export interface GithubReposResponse {
  repos: GithubRepo[];
}
