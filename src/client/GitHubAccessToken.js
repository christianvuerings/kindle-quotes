import React, { useEffect, useState } from "react";
import { Octokit } from "@octokit/rest";
import { generateAuthorizeUrl } from "./oauth";

let octokit;

const scope = "public_repo gist";

export default function GitHubAccessToken({ accessToken, setAccessToken }) {
  const [userResponse, setUserResponse] = useState();

  useEffect(() => {
    async function fetchData() {
      localStorage.setItem("accessToken", accessToken || "");

      octokit = octokit = new Octokit({
        auth: accessToken || "",
      });
      octokit.hook.error("request", async (error, options) => {
        if (error.status === 401) {
          setAccessToken("");
        }
        throw error;
      });

      if (accessToken) {
        const response = await octokit.users.getAuthenticated();
        setUserResponse(response);
      }
    }
    fetchData();
  }, [accessToken, setAccessToken]);

  useEffect(() => {
    window.handleToken = (accessToken) => setAccessToken(accessToken);
  }, [setAccessToken]);

  console.log(userResponse);

  return (
    <div>
      {!accessToken && (
        // eslint-disable-next-line react/jsx-no-target-blank
        <a href={generateAuthorizeUrl({ scope })} target="_blank">
          Login with GitHub
        </a>
      )}
      {userResponse?.data?.avatar_url ? (
        <img
          className="githubAvatar"
          src={userResponse.data.avatar_url}
          alt={userResponse.data.name}
        />
      ) : null}
    </div>
  );
}
