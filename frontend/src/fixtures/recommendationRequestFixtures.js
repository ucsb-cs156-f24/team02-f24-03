const recommendationRequestFixtures = {
    oneRequest: {
      id: 1,
      requesterEmail: "requester@gmail.com",
      professorEmail: "professor@gmail.com",
      explanation: "something",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "2022-01-02T12:00:00",
      done: false,
    },
    threeRequests: [
      {
      requesterEmail: "requester1@gmail.com",
      professorEmail: "professor1@gmail.com",
      explanation: "something1",
      dateRequested: "2022-01-02T12:00:00",
      dateNeeded: "2022-01-02T12:00:00",
      done: false,
      },
      {
        requesterEmail: "requester2@gmail.com",
        professorEmail: "professor2@gmail.com",
        explanation: "something2",
        dateRequested: "2022-01-02T12:00:00",
        dateNeeded: "2022-01-02T12:00:00",
        done: false,
      },
      {
        requesterEmail: "requester3@gmail.com",
        professorEmail: "professor3@gmail.com",
        explanation: "something3",
        dateRequested: "2022-01-02T12:00:00",
        dateNeeded: "2022-01-02T12:00:00",
        done: true,
      },
    ],
  };
  
  export { recommendationRequestFixtures };