import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { fetchGithubData } from "@/utils/fetchData";
import { getData, storeData } from "@/utils/localStorageService";
import { useSearch } from "@/context/SearchContext";
import { useRepoRefresh } from "@/context/RepoContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SearchIcon, RefreshCw } from "lucide-react";

export const Search = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { searchTerm, setSearchTerm } = useSearch();
  const { triggerRefresh } = useRepoRefresh();

  const handleFetch = async (usernameOverride?: string) => {
    setLoading(true);
    setError(null);

    const username = usernameOverride ?? input.trim();
    if (!username) {
      setLoading(false);
      return;
    }

    try {
      const newRepos = await fetchGithubData(username);

      const existing = getData();
      const existingUsers = existing?.users || [];
      const existingRepos = existing?.repos || [];

      const newUsers = existingUsers.includes(username)
        ? existingUsers
        : [...existingUsers, username];

      const filteredRepos = existingRepos.filter(
        (repo) => repo.owner !== username
      );

      const mergedRepos = [...filteredRepos, ...newRepos];

      storeData(newUsers, mergedRepos, existing?.personal_access_token);
      triggerRefresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      if (!usernameOverride) setInput("");
    }
  };

  const storedUsers = getData()?.users || [];

  return (
    <div className="space-y-3 py-1 sticky top-15 bg-white dark:bg-black">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Enter GitHub username"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-10 pl-9 pr-4"
          />
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>

        <Button
          variant="default"
          onClick={() => handleFetch()}
          disabled={!input.trim() || loading}
          className="min-w-[90px] cursor-pointer"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Fetch"}
        </Button>

        {storedUsers.length > 0 && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {storedUsers.map((user) => (
                <DropdownMenuItem
                  key={user}
                  onClick={() => handleFetch(user)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  {user}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 px-2 py-1.5 bg-red-50 rounded-md">
          {error}
        </p>
      )}

      <div className="relative">
        <Input
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 pl-9"
        />
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};
