import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App", () => {
  it("renders Vitnal hero copy", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: /spin up a react \+ typescript project in seconds/i,
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("renders CLI command preview with default project name", () => {
    render(<App />);

    expect(screen.getByRole("textbox", { name: /project name/i })).toHaveValue("vitnal-app");
    expect(screen.getByText(/npm create vitnal vitnal-app/i)).toBeInTheDocument();
  });
});

