import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticlesCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesCreatePage storybook={true} />
          </MemoryRouter>
        </QueryClientProvider>
      );
      
    // Check that it does not navigate when storybook is true
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();
    const article = {
      id: 11,
      title: "Article1",
      url: "https:url1.com",
      explanation: "Explanation1",
      email: "email1@gmail.com",
      dateadded: "2024-01-02T00:00",
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateadded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "Article1" } });
    fireEvent.change(urlField, {
      target: { value: "https:url1.com" },
    });
    fireEvent.change(explanationField, {
      target: { value: "Explanation1" },
    });
    fireEvent.change(emailField, { target: { value: "email1@gmail.com" } });
    fireEvent.change(dateAddedField, {
      target: { value: "2024-01-02T00:00" },
    });

    expect(submitButton).toBeInTheDocument();

    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "Article1",
      url: "https:url1.com",
      explanation: "Explanation1",
      email: "email1@gmail.com",
      dateadded: "2024-01-02T00:00",
    });

    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith("New article Created - id: 11 title: Article1");
      });
      
    await waitFor(() => expect(mockToast).not.toHaveBeenCalledWith(""));
      

    // Verify that navigation was called with correct path
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/articles" }),
    );
  });
});
