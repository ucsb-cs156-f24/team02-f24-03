import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
// import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: review,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/menuitemreview?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/menuitemreview`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (review) => ({
    url: "/api/menuitemreview",
    method: "PUT",
    params: {
      id: review.id,
    },
    data: {
      itemid: review.itemid,
      revieweremail: review.revieweremail,
      stars: review.stars,
      datereviewed: review.datereviewed,
      comments: review.comments,
    },
  });

  const onSuccess = (review) => {
    toast(
      `Restaurant Updated - id: ${review.id} Reviewer Email: ${review.revieweremail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreview?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Menu Item Review</h1>
        {review && (
          <MenuItemReviewForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={review}
          />
        )}
      </div>
    </BasicLayout>
  );
}
