import React, { useEffect, useState } from "react";
import "./SlideShow.css";
import { useParams } from "react-router-dom";

export default function SlideShow() {
  const { username, gistId } = useParams();
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `https://gist.githubusercontent.com/${username}/${gistId}/raw`
      );
      const jsonResponse = await response.json();
      setQuotes(jsonResponse);
    }
    fetchData();
  }, [gistId, username]);

  return (
    <div className="slideshow">
      <div className="slides">
        {quotes.map(({ quote, bookTitle }) => (
          <div className="slide" key={quote}>
            <div className="quote">{quote}</div>
            <div className="book">- {bookTitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
