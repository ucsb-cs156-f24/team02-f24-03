import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findAllByTestId("MenuItemReviewForm-itemid");
    await screen.findAllByTestId("MenuItemReviewForm-revieweremail");
    await screen.findAllByTestId("MenuItemReviewForm-stars");
    await screen.findAllByTestId("MenuItemReviewForm-datereviewed");
    await screen.findAllByTestId("MenuItemReviewForm-comments");
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a MenuItemReview", async () => {
    render(
      <Router>
        <MenuItemReviewForm
          initialContents={menuItemReviewFixtures.oneReview}
        />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-id");
    expect(screen.getByTestId("MenuItemReviewForm-itemid")).toBeInTheDocument();
    expect(screen.getByTestId("MenuItemReviewForm-stars")).toHaveValue("");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-datereviewed");
    // const emailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewForm-datereviewed",
    );
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(dateReviewedField, { target: { value: "bad-input" } });
    // fireEvent.change(localDateTimeField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findAllByTestId("MenuItemReviewForm-datereviewed");
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-submit");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText("ItemID is required.");
    expect(screen.getByText(/Reviewer Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comments is required/)).toBeInTheDocument();

    // await screen.findByText(/Name is required/);
    // expect(screen.getByText(/Description is required/)).toBeInTheDocument();

    // const nameInput = screen.getByTestId(`${testId}-name`);
    // fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
    // fireEvent.click(submitButton);

    // await waitFor(() => {
    //   expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
    // });

    // await screen.findAllByTestId("MenuItemReviewForm-itemid");
    // expect(
    //   screen.getByTestId("MenuItemReviewForm-revieweremail"),
    // ).toBeInTheDocument();
    // expect(screen.getByTestId("MenuItemReviewForm-stars")).toBeInTheDocument();
    // expect(screen.getByTestId("MenuItemReviewForm-datereviewed")).toBeInTheDocument();
    // expect(
    //   screen.getByTestId("MenuItemReviewForm-comments"),
    // ).toBeInTheDocument();
  });

  test("No error messages on valid input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <MenuItemReviewForm submitAction={mockSubmitAction} />
      </Router>,
    );

    await screen.findByTestId("MenuItemReviewForm-datereviewed");

    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewForm-datereviewed",
    );
    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-revieweremail",
    );
    const itemIDField = screen.getByTestId("MenuItemReviewForm-itemid");
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(dateReviewedField, {
      target: { value: "2024-01-01T12:00" },
    });
    fireEvent.change(reviewerEmailField, {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(itemIDField, { target: { value: "1" } });
    fireEvent.change(starsField, { target: { value: "5" } });
    fireEvent.change(commentsField, { target: { value: "great" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/dateReviewed is required/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/reviewerEmail is required/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/itemID is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/stars are required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/comments are required/)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReviewForm-cancel");
    const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
