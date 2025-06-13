import { Search } from "@/components/Search";
import { Repos } from "@/components/Repos";
import { PersonalToken } from "./components/PersonalToken";
import { ModeToggle } from "./components/ui/ModeToggle";
import { Button } from "./components/ui/button";
import { clearAllData } from "./utils/localStorageService";
import { useRepoRefresh } from "./context/RepoContext";
import reposfinderIcon from "/repo-finder.png";

function App() {
  const { triggerRefresh } = useRepoRefresh();

  const handleClearAll = () => {
    const confirmed = window.confirm(
      "This will remove your GitHub access token and all fetched repository data. Are you sure you want to proceed?"
    );
    if (!confirmed) return;

    clearAllData();
    triggerRefresh();
    window.location.reload();
  };

  return (
    <div>
      <div className="flex justify-between gap-2 items-center py-[5px] px-4 sticky top-0 bg-white dark:bg-black">
        <div className="flex items-center">
          <img
            src={reposfinderIcon}
            alt="RepoFinder"
            className="h-10 mt-[0.6rem]"
          />
          <p className="font-medium text-2xl text-[#0670bc]">ReposFinder</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            className="text-sm cursor-pointer hover:brightness-90"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
          <ModeToggle />
        </div>
      </div>
      <main className="w-[95%] md:w-[70%] xl:w-[42%] mx-auto">
        <PersonalToken />
        <Search />
        <Repos />
      </main>
    </div>
  );
}

export default App;
