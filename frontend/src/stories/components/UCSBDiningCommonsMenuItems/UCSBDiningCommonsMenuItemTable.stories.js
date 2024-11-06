import React from "react";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemTable";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemTable",
  component: UCSBDiningCommonsMenuItemTable,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  ucsbDiningCommonsMenuItems: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  ucsbDiningCommonsMenuItems: ucsbDiningCommonsMenuItemFixtures.threeMenuItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  ucsbDiningCommonsMenuItems: ucsbDiningCommonsMenuItemFixtures.threeMenuItems,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbDiningCommonsMenuItems", () => {
      return HttpResponse.json(
        { message: "UCSBDiningCommonsMenuItem deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
