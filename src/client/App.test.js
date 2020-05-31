import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders Kindle Quotes header", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Kindle Quotes/i);
  expect(linkElement).toBeInTheDocument();
});
