import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { http, HttpResponse } from "msw";

import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

export default {
  title: "pages/RecommendationRequest/RecommendationRequestEditPage",
  component: RecommendationRequestEditPage,
};

const Template = () => <RecommendationRequestEditPage storybook={true} />;

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
    http.get("/api/recommendationrequests", () => {
      return HttpResponse.json(recommendationRequestFixtures.threeRequests[0], {
        status: 200,
      });
    }),
    http.put("/api/recommendationrequests", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
