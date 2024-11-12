import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { http, HttpResponse } from "msw";

import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

export default {
  title: "pages/HelpRequest/HelpRequestEditPage",
  component: HelpRequestEditPage,
};

const Template = () => <HelpRequestEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
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
    http.get("/api/helprequests", () => {
      return HttpResponse.json(helpRequestFixtures.threeRequests[0], {
        status: 200,
      });
    }),
    http.put("/api/helprequests", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
