import React, { useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";
import { generateAuthorizeUrl } from "./oauth";

let octokit;

const scope = "public_repo";

export default function RepoList() {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  const [gistsResponse, setGistsResponse] = useState([]);

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

  useEffect(() => {
    async function fetchData() {
      localStorage.setItem("accessToken", accessToken || "");
      setupOktokit(accessToken || "");

      if (accessToken) {
        const response = await octokit.gists.list({
          per_page: 100,
        });
        setGistsResponse(response);
      }
    }
    fetchData();
  }, [accessToken]);

  useEffect(() => {
    window.handleToken = (accessToken) => setAccessToken(accessToken);
  }, []);

  console.log("accessToken", accessToken);

  return (
    <div>
      <h1>Manager Test</h1>
      {!accessToken && (
        // eslint-disable-next-line react/jsx-no-target-blank
        <a href={generateAuthorizeUrl({ scope })} target="_blank">
          Login with GitHub
        </a>
      )}
      {gistsResponse.data?.filter(Boolean).map((repo: any) => (
        <div key={repo.id}>{repo.description}</div>
      ))}
    </div>
  );
}
