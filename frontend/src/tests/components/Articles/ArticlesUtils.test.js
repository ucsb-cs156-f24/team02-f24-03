import { onDeleteSuccess } from "../../../../src/main/utils/ArticlesUtils.js";
import { toast } from "react-toastify";
import { cellToAxiosParamsDelete } from "../../../../src/main/utils/ArticlesUtils.js";

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("onDeleteSuccess", () => {
  it("calls console.log and toast with the correct message", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const message = "Delete was successful";

    onDeleteSuccess(message);

    expect(consoleSpy).toHaveBeenCalledWith(message);
    expect(toast).toHaveBeenCalledWith(message);

    consoleSpy.mockRestore(); // Clean up after the test
  });
});

describe("cellToAxiosParamsDelete", () => {
  it("returns correct axios params for DELETE request", () => {
    const cell = { row: { values: { id: 123 } } };
    const result = cellToAxiosParamsDelete(cell);

    expect(result).toEqual({
      url: "/api/articles",
      method: "DELETE",
      params: { id: 123 },
    });
  });
});
