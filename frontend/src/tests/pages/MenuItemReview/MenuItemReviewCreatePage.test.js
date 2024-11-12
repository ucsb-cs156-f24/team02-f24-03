import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
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

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Stars")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {
    const queryClient = new QueryClient();
    const review = {
      id: 1,
      itemId: 1,
      reviewerEmail: "test@gmail.com",
      stars: 5,
      localDateTime: "2024-11-11T11:11:11",
      comments: "good",
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, review);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-itemid"),
      ).toBeInTheDocument();
    });

    const itemIdInput = screen.getByTestId("MenuItemReviewForm-itemid");

    const reviewerEmailInput = screen.getByTestId(
      "MenuItemReviewForm-revieweremail",
    );

    const starsInput = screen.getByTestId("MenuItemReviewForm-stars");

    const dateReviewedInput = screen.getByTestId(
      "MenuItemReviewForm-datereviewed",
    );

    const commentsInput = screen.getByTestId("MenuItemReviewForm-comments");

    const createButton = screen.getByTestId("MenuItemReviewForm-submit");

    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: "1" } });
    fireEvent.change(reviewerEmailInput, {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(starsInput, { target: { value: "5" } });
    fireEvent.change(dateReviewedInput, {
      target: { value: "2024-11-11T11:11:11" },
    });
    fireEvent.change(commentsInput, { target: { value: "good" } });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "1",
      reviewerEmail: "test@gmail.com",
      stars: "5",
      localDateTime: "2024-11-11T11:11:11",
      comments: "good",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New review Created - id: 1 email: test@gmail.com",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
  });
});
