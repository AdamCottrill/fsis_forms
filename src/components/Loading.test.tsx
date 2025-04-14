import { render, screen } from "@testing-library/react";
import { within } from "@testing-library/dom";

import Loading from "./Loading";

describe("Loading Component", () => {
  it("renders the spinner when fetching is true", () => {
    render(<Loading isFetching={true} />);

    const myLoading = screen.getByRole("status");
    expect(myLoading).toBeInTheDocument();
    const msg = within(myLoading).getByText("Loading...");
    expect(msg).toBeInTheDocument();
  });

  it("renders nothing when isFetching is false ", () => {
    render(<Loading isFetching={false} />);

    let myLoading = screen.queryByRole("status");
    expect(myLoading).toBeNull();

    // sanity check
    myLoading = screen.queryByText("Loading...");
    expect(myLoading).toBeNull();
  });
});
