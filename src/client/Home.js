import React from "react";
import "./Home.css";
import GitHubAccessToken from "./GitHubAccessToken";
import Quotes from "./Quotes";
import UploadQuotes from "./UploadQuotes";
import GistUploadButton from "./GistUploadButton";

export default function Home() {
  const [quotes, setQuotes] = React.useState([]);
  const [accessToken, setAccessToken] = React.useState(
    localStorage.getItem("accessToken")
  );

  return (
    <div className="home">
      <div className="header">
        <h1>Kindle Quotes</h1>
        <GitHubAccessToken
          accessToken={accessToken}
          setAccessToken={setAccessToken}
        />
        <div
          style={{
            marginLeft: -8,
            marginRight: -8,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ paddingLeft: 8, paddingRight: 8 }}>
            <UploadQuotes
              quotes={quotes}
              onQuotesChange={(quotes) => setQuotes(quotes)}
            />
          </div>
          <div
            style={{
              paddingLeft: 8,
              paddingRight: 8,
            }}
          >
            {Boolean(quotes.length) && (
              <GistUploadButton
                accessToken={accessToken}
                quotes={quotes
                  .filter((quote) => quote.checked)
                  .map(({ bookTitle, quote }) => ({ quote, bookTitle }))}
              />
            )}
          </div>
        </div>
      </div>
      {Boolean(quotes.length) && (
        <Quotes quotes={quotes} onQuotesChange={setQuotes} />
      )}
    </div>
  );
}
