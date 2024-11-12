import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function MenuItemReviewForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "MenuItemReviewForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-id"}
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="itemid">Item Id</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-itemid"}
          id="itemid"
          type="text"
          isInvalid={Boolean(errors.itemid)}
          {...register("itemid", {
            required: "ItemID is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.itemid?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="revieweremail">Reviewer Email</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-revieweremail"}
          id="revieweremail"
          type="text"
          isInvalid={Boolean(errors.revieweremail)}
          {...register("revieweremail", {
            required: "Reviewer Email is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.revieweremail?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="stars">Stars</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-stars"}
          id="stars"
          type="text"
          isInvalid={Boolean(errors.stars)}
          {...register("stars", {
            required: "Stars is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.stars?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="datereviewed">Date Reviewed</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-datereviewed"}
          id="datereviewed"
          type="text"
          isInvalid={Boolean(errors.datereviewed)}
          {...register("datereviewed", {
            required: "Date Reviewed is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.datereviewed?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="comments">Comments</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-comments"}
          id="comments"
          type="text"
          isInvalid={Boolean(errors.comments)}
          {...register("comments", {
            required: "Comments is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.comments?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default MenuItemReviewForm;
