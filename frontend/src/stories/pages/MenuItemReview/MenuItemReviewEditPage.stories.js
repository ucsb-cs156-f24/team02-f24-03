import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

// import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";
// import { restaurantFixtures } from "fixtures/restaurantFixtures";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

export default {
  title: "pages/MenuItemReview/MenuItemReviewEditPage",
  component: MenuItemReviewEditPage,
};

const Template = () => <MenuItemReviewEditPage storybook={true} />;

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
    http.get("/api/menuitemreview", () => {
      return HttpResponse.json(menuItemReviewFixtures.threeReviews[0], {
        status: 200,
      });
    }),
    http.put("/api/menuitemreview", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
    http.put("/api/menuitemreview", (req) => {
      window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
