import React, { useEffect, useState } from "react";
import "./SlideShow.css";
import { useParams } from "react-router-dom";
import { useTransition, animated } from "react-spring";

export default function SlideShow() {
  const { username, gistId } = useParams();
  const [quotes, setQuotes] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://gist.githubusercontent.com/${username}/${gistId}/raw`
      );
      const jsonResponse = await response.json();

      const quotesWithBookData = await Promise.all(
        jsonResponse.map(async ({ quote, bookTitle }) => {
          const params = new URLSearchParams({
            q: bookTitle.replace("(Christian Vuerings)", ""),
            maxResults: 1,
            key: "AIzaSyD78sczo2XFjok6QWEIcEYMfgXTa-GWaJ8",
          });

          const url = new URL("https://www.googleapis.com/books/v1/volumes");
          url.search = params.toString();

          const response = await fetch(url);
          const jsonResponse = await response.json();

          const { imageLinks, industryIdentifiers, infoLink, title, authors } =
            jsonResponse?.items?.[0]?.volumeInfo ?? {};

          return {
            quote,
            bookTitle,
            ...(jsonResponse.items
              ? {
                  imageLinks,
                  industryIdentifiers,
                  infoLink,
                  title,
                  authors,
                }
              : {}),
          };
        })
      );

      setQuotes(quotesWithBookData);
    }
    fetchData();
  }, [gistId, username]);

  useEffect(() => {
    if (!quotes.length) {
      return;
    }

    const nextIndex = (index + 1) % quotes.length;
    const { quote: nextQuote } = quotes[nextIndex];

    const timeout = setTimeout(() => {
      setIndex(nextIndex);
    }, 5000 + nextQuote.split(" ").length * 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [index, quotes]);

  const transitions = useTransition(index, (p) => p, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <div className="slideshow">
      <div className="slides">
        {transitions.map(({ item, props, key }) => {
          if (!quotes.length) {
            return null;
          }
          const { quote, bookTitle, authors, title } = quotes[item];

          return (
            <animated.div className="slide" key={key} style={{ ...props }}>
              <>
                <div className="quote">{quote}</div>
                <div className="book">
                  - {title ? `${title} (${authors[0]})` : bookTitle}
                </div>
              </>
            </animated.div>
          );
        })}
      </div>
    </div>
  );
}
