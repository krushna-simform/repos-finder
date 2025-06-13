interface Repo {
  id: number;
  name: string;
  pullRequest: Array<PullRequest> | null;
  url: string;
  owner: string;
  owner_url: string;
}

interface PullRequest {
  id: number;
  title: string;
  html_url: string;
}

interface LocalStorage {
  users: Array<string>;
  repos: Array<Repo>;
  personal_access_token?: string;
}

enum SortingRepo {
  allRepos = "All Repos",
  withPullRequest = "With Pull Request",
  withoutPullRequest = "Without Pull Request",
}

export type { Repo, PullRequest, LocalStorage, SortingRepo };
