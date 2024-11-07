import React from "react";
import HelpRequestTable from "main/components/HelpRequest/HelpRequestTable";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
    title: "components/HelpRequest/HelpRequestTable",
    component: HelpRequestTable,
};

const Template = (args) => {
    return <HelpRequestTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
    requests: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    requests: helpRequestFixtures.threeRequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    requests: helpRequestFixtures.threeRequests,
    currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
    msw: [
        http.delete("/api/helprequests", () => {
            return HttpResponse.json({}, { status: 200 });
        }),
    ],
};