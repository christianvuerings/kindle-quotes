import React from "react";

export default function Quotes({ quotes, onQuotesChange }) {
  const handleChecked = ({ index, event }) => {
    const copy = [...quotes];
    copy[index].checked = !copy[index].checked;

    onQuotesChange(copy);
  };

  const handleQuoteChange = ({ index, event }) => {
    const copy = [...quotes];
    copy[index].quote = event.currentTarget.textContent;
    onQuotesChange(copy);
  };

  return (
    <div className="quotes">
      {quotes.map(({ quote, checked }, index) => (
        <div className="quote" key={index}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => handleChecked({ event, index })}
          />
          {Boolean(checked)}
          <div
            className="textarea"
            onBlur={(event) => handleQuoteChange({ event, index })}
            contentEditable
            suppressContentEditableWarning
          >
            {quote}
          </div>
        </div>
      ))}
    </div>
  );
}
