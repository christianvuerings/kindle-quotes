import React, { useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";
import { usePromise } from "./usePromise";
import { generateAuthorizeUrl } from "./oauth";

let octokit;

const scope = "public_repo";

export default function RepoList() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  const setupOktokit = (accessToken) => {
    octokit = octokit = new Octokit({
      auth: accessToken,
    });
    octokit.hook.error("request", async (error, options) => {
      if (error.status === 401) {
        setAccessToken("");
      }
      throw error;
    });
  };

  const githubRepoRequest = usePromise({
    promiseFunction: async () =>
      octokit.gists.list({
        per_page: 100,
      }),
  });

  useEffect(() => {
    localStorage.setItem("accessToken", accessToken || "");
    setupOktokit(accessToken || "");

    if (accessToken) {
      githubRepoRequest.call();
    }
  }, [accessToken, githubRepoRequest]);

  useEffect(() => {
    window.handleToken = (accessToken) => setAccessToken(accessToken);
  }, []);

  console.log("githubRepoRequest", githubRepoRequest);

  return (
    <div>
      <h1>Manager Test</h1>
      {!accessToken && (
        <a
          href={generateAuthorizeUrl({ scope })}
          target="_blank"
          rel="noopener noreferrer"
        >
          Login with GitHub
        </a>
      )}
      {githubRepoRequest.pending && <p>pending</p>}
      {githubRepoRequest.value?.data?.filter(Boolean).map((repo: any) => (
        <div key={repo.id}>{repo.description}</div>
      ))}
    </div>
  );
}
