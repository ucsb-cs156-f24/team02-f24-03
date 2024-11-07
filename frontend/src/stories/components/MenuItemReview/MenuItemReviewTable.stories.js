import React from "react";
import RestaurantTable from "main/components/Restaurants/RestaurantTable";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

export default {
  title: "components/MenuItemReview/MenuItemReviewTable",
  component: MenuItemReviewTable,
};

const Template = (args) => {
  return <MenuItemReviewTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  reviews : [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  reviews : menuItemReviewFixtures.threeReviews,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  restaurants: menuItemReviewFixtures.threeReviews,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/menuitemreview", () => {
      return HttpResponse.json(
        { message: "Restaurant deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
