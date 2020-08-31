import React from "react";

// TODO

// Google book integration (key: AIzaSyD78sczo2XFjok6QWEIcEYMfgXTa-GWaJ8)
// https://www.googleapis.com/books/v1/volumes?q=Anxiety%20and%20disconnection%20also%20emerged%20as%20drivers%20of%20numbing%20in%20addition%20to%20shame.&maxResults=1&key=AIzaSyD78sczo2XFjok6QWEIcEYMfgXTa-GWaJ8

export default function Quotes({ quotes, onQuotesChange }) {
  const inputFile = React.useRef(null);

  const fixQuote = (quote) => {
    console.log("fixQuote");
    if (quote.match(/^‘/) && quote.match(/’$/)) {
      quote = quote.substring(1, quote.length - 1);
    }
    if (quote.match(/^“/) && quote.match(/”$/)) {
      quote = quote.substring(1, quote.length - 1);
    }
    if (quote.match(/^"/) && quote.match(/"$/)) {
      quote = quote.substring(1, quote.length - 1);
    }
    if (quote.match(/^"(?!.*")/)) {
      quote = quote.substring(1, quote.length);
    }
    if (quote.match(/^\(.*\)$/)) {
      quote = quote.substring(1, quote.length - 1);
    }
    if (quote.match(/^\((?!.*\))/)) {
      quote = quote.substring(1, quote.length);
    }
    if (quote.match(/^[A-Za-z]/)) {
      quote = quote.charAt(0).toUpperCase() + quote.slice(1);
    }

    quote = quote.replace(/,$/, ".");
    return quote;
  };

  const shuffleArray = (arr) => {
    const newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr;
  };

  const parseText = (text) =>
    text
      .split("==========")
      .map((items) => {
        const lines = items.trim().split("\n");
        const quote = fixQuote(lines[3] || "");
        const words = quote.split(" ").length;
        return {
          bookTitle: lines[0],
          info: lines[1],
          quote,
          words,
        };
      })
      .filter(({ quote, words }) => quote && words > 2)
      .reduce((acc, current) => {
        const x = acc.find((item) => item.quote === current.quote);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

  const handleFileChange = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];

    const text = await new Response(file).text();
    onQuotesChange(shuffleArray(parseText(text)).slice(0, 100));
  };

  return (
    <button className="button">
      {Boolean(quotes.length) ? "Upload new" : "Upload"} Clippings.txt{" "}
      <input
        className="button-upload-input"
        type="file"
        ref={inputFile}
        accept=".txt"
        onChange={handleFileChange}
        tabIndex={-1}
      />
    </button>
  );
}
