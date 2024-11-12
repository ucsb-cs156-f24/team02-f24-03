const menuItemReviewFixtures = {
  oneReview: [
    {
      id: 1,
      itemid: 1,
      revieweremail: "test@ucsb.edu",
      stars: 5,
      datereviewed: "2024-11-11T11:11:11",
      comments: "good",
    },
  ],

  threeReviews: [
    {
      id: 1,
      itemid: 7,
      revieweremail: "test@ucsb.edu",
      stars: 5,
      datereviewed: "2024-11-11T11:11:12",
      comments: "good",
    },
    {
      id: 2,
      itemid: 2,
      revieweremail: "test1@ucsb.edu",
      stars: 0,
      datereviewed: "2024-11-11T11:11:13",
      comments: "bad",
    },
    {
      id: 3,
      itemid: 3,
      revieweremail: "test2@ucsb.edu",
      stars: 2,
      datereviewed: "2024-11-11T11:11:11",
      comments: "ok",
    },
  ],
};

export { menuItemReviewFixtures };
