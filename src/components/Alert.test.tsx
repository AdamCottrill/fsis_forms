import { render, screen } from "@testing-library/react";

import { Alert } from "./Alert";

describe("Alert Component", () => {
  it("renders the alert with the correct message", () => {
    render(
      <Alert
        variant="danger"
        dismissible={true}
        headingText="Test Header:"
        message="This is the test message."
      />,
    );

    const myAlert = screen.getByRole("alert");
    expect(myAlert).toBeInTheDocument();
    expect(myAlert).toHaveClass("alert-danger");
    expect(myAlert).toHaveClass("alert-dismissible");
    expect(myAlert).toHaveTextContent("This is the test message.");
  });

  it("renders the alert with the correct header", () => {
    render(<Alert headingText="Test Header:" />);

    const myAlert = screen.getByRole("alert");
    expect(myAlert).toBeInTheDocument();
    expect(myAlert).toHaveTextContent("Test Header:");
  });

  it("renders the alert with success and not dissmissible", () => {
    render(
      <Alert
        variant="success"
        dismissible={false}
        headingText="Test Header:"
        message="This is the test message."
      />,
    );

    const myAlert = screen.getByRole("alert");
    expect(myAlert).toBeInTheDocument();
    expect(myAlert).toHaveClass("alert-success");
    expect(myAlert.className).toEqual(
      expect.not.stringContaining("alert-dismissible"),
    );
    expect(myAlert).toHaveTextContent("This is the test message.");
  });
});
