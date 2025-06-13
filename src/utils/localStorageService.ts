import type { LocalStorage, Repo } from "@/types/type";

const LOCAL_STORAGE_KEY = "repos-finder";

const storeData = (
  users: Array<string>,
  repos: Array<Repo>,
  personal_access_token?: string
) => {
  const data: LocalStorage = {
    users,
    repos,
    personal_access_token,
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
};

const getData = (): LocalStorage | null => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as LocalStorage) : null;
};

const clearAllData = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export { storeData, getData, clearAllData };
