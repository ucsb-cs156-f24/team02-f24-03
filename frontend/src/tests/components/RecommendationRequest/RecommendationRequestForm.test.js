import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByText(/Professor Email/);
    await screen.findByText(/Create/);
    // await screen.findByTestId("RecommendationRequest-cancel");
  });

  test("renders correctly when passing in a recommendation request", async () => {
    render(
      <Router>
        <RecommendationRequestForm
          initialContents={recommendationRequestFixtures.oneRequest}
        />
      </Router>,
    );
    await screen.findByTestId(/RecommendationRequestForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on bad input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const doneField = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(professorEmailField, { target: { value: "bad-input" } });
    fireEvent.change(requesterEmailField, { target: { value: "bad-input" } });
    fireEvent.change(dateNeededField, { target: { value: "bad-input" } });
    fireEvent.change(dateRequestedField, { target: { value: "bad-input" } });
    fireEvent.change(explanationField, { target: { value: "bad-input" } });
    fireEvent.change(doneField, { target: { value: "bad-input" } });
    fireEvent.click(submitButton);

    await screen.findByText(/requesterEmail is required./i);
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.click(submitButton);

    // Check for the actual error messages displayed when inputs are missing
    await screen.findByText(/requesterEmail is required./i);
    expect(
      screen.getByText(/professorEmail is required./i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/date requested is required./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/date needed is required./i)).toBeInTheDocument();
    expect(screen.getByText(/explanation is required./i)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <RecommendationRequestForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("RecommendationRequestForm-professorEmail");

    const professorEmailField = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const requesterEmailField = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const dateRequestedField = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const dateNeededField = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const explanationField = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    const done = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(professorEmailField, {
      target: { value: "professor@example.com" },
    });
    fireEvent.change(requesterEmailField, {
      target: { value: "requester@example.com" },
    });
    fireEvent.change(dateRequestedField, {
      target: { value: "2024-11-01T12:00" },
    });
    fireEvent.change(dateNeededField, {
      target: { value: "2024-12-01T12:00" },
    });
    fireEvent.change(explanationField, {
      target: { value: "Explanation for recommendation" },
    });
    fireEvent.change(done, { target: { value: "true" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  });

  test("calls navigate(-1) when Cancel is clicked", async () => {
    render(
      <Router>
        <RecommendationRequestForm />
      </Router>,
    );
    const cancelButton = screen.getByTestId("RecommendationRequest-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});