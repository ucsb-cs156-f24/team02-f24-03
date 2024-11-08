import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Organization Code",
    "Organization Translation Short",
    "Organization Translation",
    "Inactive",
  ];
  const expectedIds = [
    "orgCode",
    "orgTranslationShort",
    "orgTranslation",
    "inactive",
  ];
  const testId = "UCSBOrganizationForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    await screen.findByTestId(`${testId}-orgCode`);
    expectedIds.forEach((idText) => {
      const testid = screen.getByTestId(`${testId}-${idText}`);
      expect(testid).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm
            initialContents={ucsbOrganizationFixtures.oneOrganization}
            buttonLabel="Update"
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Update/)).toBeInTheDocument();
    expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    await screen.findByTestId(`${testId}-orgCode`);
    expectedIds.forEach((idText) => {
      const testid = screen.getByTestId(`${testId}-${idText}`);
      expect(testid).toBeInTheDocument();
    });
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Organization Code is required/);
    expect(
      screen.getByText(/Organization Translation Short is required/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Organization Translation is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Inactive status is required/)).toBeInTheDocument();

    const nameInput = screen.getByTestId(`${testId}-orgTranslationShort`);
    fireEvent.change(nameInput, { target: { value: "a".repeat(16) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 15 characters/)).toBeInTheDocument();
    });
  });
});
