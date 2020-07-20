import React from "react";
import { Octokit } from "@octokit/rest";

export default function GistUploadButton({ accessToken, quotes }) {
  const handleClick = async () => {
    const accessToken = localStorage.getItem("accessToken");

    console.log(accessToken);

    const octokit = new Octokit({
      auth: accessToken,
    });

    const response = await octokit.gists.create({
      description: `Kindle Quotes: ${new Date().toISOString()}`,
      public: true,
      files: {
        "kindle-quotes.json": {
          content: JSON.stringify(quotes, null, 4),
        },
      },
    });

    console.log(response);
    window.open(response.data.html_url);
  };
  return (
    <button disabled={!quotes.length} className="button" onClick={handleClick}>
      Upload quotes to gist
    </button>
  );
}
