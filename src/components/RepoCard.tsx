import type { Repo } from "@/types/type";
import { GitPullRequest } from "lucide-react";

export const RepoCard = ({ repo }: { repo: Repo }) => {
  return (
    <div
      key={repo.id}
      className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm dark:shadow-md bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline truncate max-w-[70%]"
        >
          {repo.name}
        </a>
        <a
          href={repo.owner_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-gray-800 dark:hover:text-gray-100"
        >
          @<span className="ml-0.5">{repo.owner}</span>
        </a>
      </div>

      {repo.pullRequest?.map((pr) => (
        <div key={pr.id} className="mt-4 ml-1 flex items-start gap-2">
          <GitPullRequest className="h-4 w-4 ml-5 mt-0.5 text-blue-600 dark:text-blue-400" />
          <a
            href={pr.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
          >
            {pr.title}
          </a>
        </div>
      ))}
    </div>
  );
};
