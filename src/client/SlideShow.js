import React, { useEffect, useState } from "react";
import "./SlideShow.css";
import { useParams } from "react-router-dom";
import { useTransition, animated } from "react-spring";

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

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
            q: bookTitle
              .replace("(Christian Vuerings)", "")
              .replace(/\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+/, "")
              .trim(),
            maxResults: 1,
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

      setQuotes(shuffle(quotesWithBookData));
    }
    fetchData();
  }, [gistId, username]);

  useEffect(() => {
    if (!quotes.length) {
      return;
    }

    const nextIndex = (index + 1) % quotes.length;
    const { quote: currentQuote } = quotes[index];

    const timeout = setTimeout(() => {
      setIndex(nextIndex);
    }, 5000 + currentQuote.split(" ").length * 200);

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
