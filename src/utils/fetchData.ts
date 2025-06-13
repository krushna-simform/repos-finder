import type { PullRequest, Repo } from "@/types/type";
import { getData } from "@/utils/localStorageService";

const URL = "https://api.github.com/users";

export const fetchGithubData = async (userName: string): Promise<Repo[]> => {
  const localData = getData();
  const token = localData?.personal_access_token;

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    ...(token && { Authorization: `token ${token}` }),
  };

  const repoDetails: Array<Repo> = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const repoResponse = await fetch(
      `${URL}/${userName}/repos?per_page=100&page=${page}`,
      { headers }
    );

    if (!repoResponse.ok) {
      throw new Error(`Failed to fetch repos for ${userName}`);
    }

    const repos = await repoResponse.json();

    for (const repo of repos) {
      const prsResponse = await fetch(
        `https://api.github.com/repos/${userName}/${repo.name}/pulls`,
        { headers }
      );

      const pullRequests = await prsResponse.json();

      repoDetails.push({
        id: repo.id,
        name: repo.name,
        url: repo.html_url,
        owner: userName,
        owner_url: repo.owner?.html_url || "",
        pullRequest: pullRequests.map((pr: PullRequest) => ({
          id: pr.id,
          title: pr.title,
          html_url: pr.html_url,
        })),
      });
    }

    const linkHeader = repoResponse.headers.get("Link");
    hasNextPage = linkHeader?.includes('rel="next"') ?? false;
    page++;
  }

  return repoDetails;
};
