const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "bsaiju@ucsb.edu",
    teamId: "007",
    tableOrBreakoutRoom: "table",
    requestTime: "2022-01-02T12:00:00",
    explanation: "prod is acting up!",
    solved: "true",
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "bsaiju@ucsb.edu",
      teamId: "007",
      tableOrBreakoutRoom: "table",
      requestTime: "2022-01-02T12:00:00",
      explanation: "prod is acting up!",
      solved: "true",
    },
    {
      id: 2,
      requesterEmail: "fake@email.org",
      teamId: "thisIsMyTeam",
      tableOrBreakoutRoom: "breakoutRoom",
      requestTime: "2023-02-03T12:00:00",
      explanation: "qa is not working! ;-;",
      solved: "false",
    },
    {
      id: 3,
      requesterEmail: "another@email.com",
      teamId: "thisIsAnotherTeamSmile",
      tableOrBreakoutRoom: "neither",
      requestTime: "2021-03-04T12:00:00",
      explanation: "Everything is screwed up! D:<",
      solved: "true",
    },
  ],
};

export { helpRequestFixtures };
