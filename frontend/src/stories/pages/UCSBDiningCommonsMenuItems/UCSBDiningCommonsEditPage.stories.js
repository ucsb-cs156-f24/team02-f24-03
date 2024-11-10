import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemEditPage";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";

export default {
  title: "pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemEditPage",
  component: UCSBDiningCommonsMenuItemEditPage,
};

const Template = () => <UCSBDiningCommonsMenuItemEditPage storybook={true} />;

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
    http.get("/api/ucsbdiningcommonsmenuitem", () => {
      return HttpResponse.json(
        ucsbDiningCommonsMenuItemFixtures.threeMenuItems[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/ucsbdiningcommonsmenuitem", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
    http.put("/api/ucsbdiningcommonsmenuitem", (req) => {
      window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
