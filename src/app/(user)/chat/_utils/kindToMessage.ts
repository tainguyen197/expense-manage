import { MessageKind } from "@/types/message";

export const kindToMessage = (kind: MessageKind) => {
  switch (kind) {
    case "add_expense":
      return {
        message: "Thêm chi phí",
        variant: "success",
      };
    case "delete_expense":
      return {
        message: "Xoá chi phí",
        variant: "error",
      };
    case "add_income":
      return {
        message: "Thêm thu nhập",
        variant: "success",
      };
    case "delete_income":
      return {
        message: "Xoá thu nhập",
        variant: "error",
      };
    case "default":
      return {
        message: "Mặc định",
        variant: "info",
      };
  }
};
