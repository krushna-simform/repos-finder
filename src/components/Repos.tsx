import { useEffect, useState } from "react";
import { getData, storeData } from "@/utils/localStorageService";
import type { Repo } from "@/types/type";
import { useSearch } from "@/context/SearchContext";
import Fuse from "fuse.js";
import { RepoCard } from "./RepoCard";
import { SortingRepo } from "@/types/sorting.type";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { useRepoRefresh } from "@/context/RepoContext";

export const Repos = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [sortFilter, setSortFilter] = useState<SortingRepo>(
    SortingRepo.allRepos
  );
  const { searchTerm } = useSearch();
  const { refresh } = useRepoRefresh();

  useEffect(() => {
    const stored = getData();
    if (stored) {
      setRepos(stored.repos || []);
      setUsers(stored.users || []);
    }
  }, [refresh]);

  const handleDeleteUser = (user: string) => {
    const updatedUsers = users.filter((u) => u !== user);
    const updatedRepos = repos.filter((r) => r.owner !== user);
    setUsers(updatedUsers);
    setRepos(updatedRepos);
    setSelectedUser(null);
    const existing = getData();
    storeData(updatedUsers, updatedRepos, existing?.personal_access_token);
  };

  const fuse = new Fuse(repos, {
    keys: ["name"],
    threshold: 0.4,
  });

  let filteredRepos =
    searchTerm.trim() === ""
      ? repos
      : fuse.search(searchTerm).map((result) => result.item);

  if (selectedUser) {
    filteredRepos = filteredRepos.filter((repo) => repo.owner === selectedUser);
  }

  filteredRepos = filteredRepos.filter((repo) => {
    if (sortFilter === SortingRepo.withPullRequest) {
      return repo.pullRequest && repo.pullRequest.length > 0;
    }
    if (sortFilter === SortingRepo.withoutPullRequest) {
      return !repo.pullRequest || repo.pullRequest.length === 0;
    }
    return true;
  });

  return (
    <div className="pace-y-6">
      <div className="sticky top-40 py-3 bg-white/30 dark:bg-black/30 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {users.map((user) => {
            const userRepoCount = repos.filter((r) => r.owner === user).length;
            return (
              <div
                key={user}
                className={`flex items-center px-3 py-1 rounded-full text-sm border cursor-pointer transition-colors ${
                  selectedUser === user
                    ? "bg-blue-100 dark:bg-blue-800/20 border-blue-400 text-blue-700 dark:text-blue-300"
                    : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                } hover:shadow-sm`}
                onClick={() =>
                  setSelectedUser((prev) => (prev === user ? null : user))
                }
              >
                <span className="mr-1 font-medium">{user}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({userRepoCount})
                </span>
                <X
                  className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400"
                  onClick={(e) => {
                    const confirm = window.confirm(
                      `This will remove ${user}'s fetched repository data. Are you sure you want to proceed?`
                    );
                    if (!confirm) return;
                    e.stopPropagation();
                    handleDeleteUser(user);
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 cursor-pointer"
              >
                {sortFilter} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 dark:bg-gray-900 dark:text-white"
            >
              {Object.entries(SortingRepo).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSortFilter(label as SortingRepo)}
                  className="hover:bg-blue-100 dark:hover:bg-blue-800/30 cursor-pointer"
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredRepos.length > 0 ? (
        <div className="space-y-4 py-5 px-1">
          {filteredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center pt-24">
          No matching repos found
          {searchTerm && <span> for "{searchTerm}"</span>}
        </p>
      )}
    </div>
  );
};
