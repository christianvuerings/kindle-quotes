import React from "react";
import GitHubAccessToken from "./GitHubAccessToken";
import Quotes from "./Quotes";
import UploadQuotes from "./UploadQuotes";
import GistUploadButton from "./GistUploadButton";
import "./App.css";

function App() {
  const [quotes, setQuotes] = React.useState([]);
  const [accessToken, setAccessToken] = React.useState(
    localStorage.getItem("accessToken")
  );

  return (
    <div className="app">
      <div className="header">
        <h1>Kindle Quotes</h1>
        <GitHubAccessToken
          accessToken={accessToken}
          setAccessToken={setAccessToken}
        />
        <UploadQuotes
          quotes={quotes}
          onQuotesChange={(quotes) => setQuotes(quotes)}
        />
        {Boolean(quotes.length) && (
          <GistUploadButton
            accessToken={accessToken}
            quotes={quotes
              .filter((quote) => quote.checked)
              .map(({ bookTitle, quote }) => ({ quote, bookTitle }))}
          />
        )}
      </div>
      {Boolean(quotes.length) && (
        <Quotes quotes={quotes} onQuotesChange={setQuotes} />
      )}
    </div>
  );
}

export default App;
