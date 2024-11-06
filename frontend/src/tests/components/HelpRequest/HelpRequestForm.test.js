import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

describe("HelpRequestForm tests", () => {
    test("renders correctly", async () => {
        render(
            <Router>
                <HelpRequestForm />
            </Router>,
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in a HelpRequest", async () => {
        render(
            <Router>
                <HelpRequestForm initialContents={helpRequestFixtures.oneRequest} />
            </Router>,
        );
        await screen.findByTestId(/HelpRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/HelpRequestForm-id/)).toHaveValue("1");
    });

    test("Correct Error messsages on bad input", async () => {
        render(
            <Router>
                <HelpRequestForm />
            </Router>,
        );
        await screen.findByTestId("HelpRequestForm-requestTime");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        // const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requestTimeField, { target: { value: "bad-input" } });
        // fireEvent.change(solvedField, { target: { value: "bad-input" } });
        fireEvent.click(submitButton);

        await screen.findByText(/Request Time is required./);
    });

    test("Correct Error messsages on missing input", async () => {
        render(
            <Router>
                <HelpRequestForm />
            </Router>,
        );
        await screen.findByTestId("HelpRequestForm-submit");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Requester Email is required./);
        expect(screen.getByText(/Team Id is required./)).toBeInTheDocument();
        expect(screen.getByText(/Table Or Breakout Room is required./)).toBeInTheDocument();
        expect(screen.getByText(/Request Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Solved is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router>
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>,
        );
        await screen.findByTestId("HelpRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: "bsaiju@ucsb.edu" } });
        fireEvent.change(teamIdField, { target: { value: "007" } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: "table" } });
        fireEvent.change(requestTimeField, {
            target: { value: "2022-01-02T12:00" },
        });
        fireEvent.change(explanationField, { target: { value: "this is the explanation." } });
        fireEvent.change(solvedField, { target: { value: "true" } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        // expect(
        //     screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/),
        // ).not.toBeInTheDocument();
        expect(
            screen.queryByText(/Request Time is required./),
        ).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router>
                <HelpRequestForm />
            </Router>,
        );
        await screen.findByTestId("HelpRequestForm-cancel");
        const cancelButton = screen.getByTestId("HelpRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});