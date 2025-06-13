import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getData, storeData } from "@/utils/localStorageService";

export const PersonalToken = () => {
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getData();
    if (!stored?.personal_access_token) {
      setShowModal(true);
    }
  }, []);

  const isValidToken = token.trim().startsWith("github_pat_");

  const handleSubmit = () => {
    if (!isValidToken) {
      setError("Access token must start with 'github_pat_'");
      return;
    }

    const stored = getData();
    storeData(stored?.users || [], stored?.repos || [], token.trim());
    setShowModal(false);
  };

  if (!showModal) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl space-y-5 animate-fade-in text-gray-800 dark:text-gray-100">
        <h2 className="text-2xl font-bold text-center">
          GitHub Access Token Required
        </h2>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          GitHub allows only{" "}
          <span className="font-medium">60 requests/hour</span> without
          authentication. By providing a token, you can make up to{" "}
          <span className="font-medium">5000 requests/hour</span>.
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
          <p className="font-semibold">How to generate a token:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Visit{" "}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline"
              >
                GitHub Personal Access Tokens
              </a>
            </li>
            <li>Click “Generate new token” → “Fine-grained token”</li>
            <li>Select repository access as “Public Repos”</li>
            <li>Generate and copy the token</li>
            <li>Paste it in the field below</li>
          </ol>
        </div>

        <div className="space-y-2">
          <Input
            type="text"
            placeholder="github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError("");
            }}
            className="rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 text-black dark:text-white dark:bg-gray-900"
          />
          {isValidToken && (
            <p className="text-xs text-blue-600 dark:text-blue-400 border-l-2 border-blue-500 pl-2 mt-1">
              We are trusting you that you are providing correct access token.
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 -mt-1">
              {error}
            </p>
          )}
          <Button
            onClick={handleSubmit}
            className="w-full rounded-lg text-white dark:text-black dark:bg-white cursor-pointer"
            disabled={!isValidToken}
          >
            Submit Token
          </Button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Your token is stored only in your browser and never sent externally.
        </p>
      </div>
    </div>,
    document.body
  );
};
