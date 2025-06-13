import { Search } from "@/components/Search";
import { Repos } from "@/components/Repos";
import { PersonalToken } from "./components/PersonalToken";
import { ModeToggle } from "./components/ui/ModeToggle";
import { Button } from "./components/ui/button";
import { clearAllData } from "./utils/localStorageService";
import { useRepoRefresh } from "./context/RepoContext";

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
      <div className="flex justify-end gap-2 items-center p-3">
        <Button
          variant="destructive"
          className="text-sm cursor-pointer hover:brightness-90"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
        <ModeToggle />
      </div>
      <main className="w-[95%] md:w-[70%] xl:w-[40%] mx-auto mt-10">
        <PersonalToken />
        <Search />
        <Repos />
      </main>
    </div>
  );
}

export default App;
