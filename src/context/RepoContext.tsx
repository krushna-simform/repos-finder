import { createContext, useContext, useState } from "react";

type RepoRefreshContextType = {
  refresh: boolean;
  triggerRefresh: () => void;
};

const RepoRefreshContext = createContext<RepoRefreshContextType | undefined>(
  undefined
);

export const RepoRefreshProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh((prev) => !prev);

  return (
    <RepoRefreshContext.Provider value={{ refresh, triggerRefresh }}>
      {children}
    </RepoRefreshContext.Provider>
  );
};

export const useRepoRefresh = () => {
  const context = useContext(RepoRefreshContext);
  if (!context)
    throw new Error("useRepoRefresh must be used within RepoRefreshProvider");
  return context;
};
