import React from "react";
import { render, screen } from "@testing-library/react";
import SimpleTable from "./SimpleTable";

describe("displays table data", () => {
  const data = [
    {
      title: "Beautiful cooking",
      isbn: "5454-5587-3210",
      author: "null-walter@echocat.org",
      date: "21.05.2011",
    },
  ];

  it("should paste it into the greetings text", () => {
    render(<SimpleTable data={data} sortByName={() => {}} sortedBy={null} />);
    expect(screen.getByText(/Beautiful cooking/)).toBeInTheDocument();
  });
});
