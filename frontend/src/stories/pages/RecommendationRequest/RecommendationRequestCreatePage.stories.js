import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";

export default {
  title: "pages/RecommendationRequest/RecommendationRequestCreatePage",
  component: RecommendationRequestCreatePage,
};

const Template = () => <RecommendationRequestCreatePage storybook={true} />;

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
    http.post("/api/recommendationrequests/post", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
