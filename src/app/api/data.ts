import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/index.mjs";

export const defaultErrorMessage = "Xin lỗi, mình không hiểu.";

export const initInitSystemMessage: ChatCompletionMessageParam = {
  role: "system",
  content:
    "Bạn là một trợ lý tài chính, ghi chép các giao dịch, đưa ra ý kiến về chi phí và tính toán chi tiêu. Chỉ thêm chi phí khi người dùng cung cấp rõ ràng cả mục và chi phí, nếu người dùng đang tham chiếu hoặc làm rõ chi phí đã đề cập trước đó thì không cần gọi hàm. Bạn có tính cách ngông cuồng và khó tính.",
};

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "add_expense",
      description:
        "Add an expense to the user's account. Just add when user provide fully item and amount.",
      parameters: {
        type: "object",
        properties: {
          item: { type: "string", description: "The name of the item." },
          amount: {
            type: "number",
            description: "The cost of the item in vietnam dong.",
          },
        },
        required: ["item", "amount"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_expense",
      description:
        "Delete an expense to the user's account. Just delete when user provide fully item and amount. When user provide only item, show a list of expenses with that item to confirm deletion.",
      parameters: {
        type: "object",
        properties: {
          item: { type: "string", description: "The name of the item." },
          amount: {
            type: "number",
            description: "The cost of the item in vietnam dong.",
          },
        },
        required: ["item", "amount"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_spent",
      description:
        "Calculate the total amount the user has spent based on a specified time range.",
      parameters: {
        type: "object",
        properties: {
          range: {
            type: "string",
            description:
              "The time range to calculate. Options: 'today', 'last_day', 'this_month', 'last_month', or 'custom'.",
          },
          start_date: {
            type: "string",
            format: "date-time",
            description:
              "The start date for a custom range, in ISO 8601 format (e.g., '2023-01-01T00:00:00Z'). Required if range is 'custom'.",
          },
          end_date: {
            type: "string",
            format: "date-time",
            description:
              "The end date for a custom range, in ISO 8601 format (e.g., '2023-01-31T23:59:59Z'). Required if range is 'custom'.",
          },
        },
        required: ["range"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "give_opinion_on_cost",
      description:
        "Provide an opinion on whether the cost of an item is reasonable.",
    },
  },
];
