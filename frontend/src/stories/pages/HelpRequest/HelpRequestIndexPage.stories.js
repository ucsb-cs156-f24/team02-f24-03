import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { http, HttpResponse } from "msw";

import HelpRequestIndexPage from "main/pages/HelpRequest/HelpRequestIndexPage";

export default {
    title: "pages/HelpRequest/HelpRequestIndexPage",
    component: HelpRequestIndexPage,
};

const Template = () => <HelpRequestIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        http.get("/api/currentUser", () => {
            return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
                status: 200,
            });
        }),
        http.get("/api/systemInfo", () => {
            return HttpResponse.json(systemInfoFixtures.showingNeither, {
                status: 200,
            });
        }),
        http.get("/api/helprequests/all", () => {
            return HttpResponse.json([], { status: 200 });
        }),
    ],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
    msw: [
        http.get("/api/currentUser", () => {
            return HttpResponse.json(apiCurrentUserFixtures.userOnly);
        }),
        http.get("/api/systemInfo", () => {
            return HttpResponse.json(systemInfoFixtures.showingNeither);
        }),
        http.get("/api/helprequests/all", () => {
            return HttpResponse.json(helpRequestFixtures.threeRequests);
        }),
    ],
};

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        http.get("/api/currentUser", () => {
            return HttpResponse.json(apiCurrentUserFixtures.adminUser);
        }),
        http.get("/api/systemInfo", () => {
            return HttpResponse.json(systemInfoFixtures.showingNeither);
        }),
        http.get("/api/helprequests/all", () => {
            return HttpResponse.json(helpRequestFixtures.threeRequests);
        }),
        http.delete("/api/helprequests", () => {
            return HttpResponse.json({}, { status: 200 });
        }),
    ],
};
