import { Category } from "@/types/category";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/index.mjs";

export const defaultErrorMessage = "Xin lỗi, mình không hiểu.";

export const defaultCategory = [
  { id: 1, name: "Nhà ở", icon: "🏠" },
  { id: 2, name: "Giao thông", icon: "🚗" },
  { id: 3, name: "Ăn uống", icon: "🍔" },
  { id: 4, name: "Cá nhân/Sức khỏe", icon: "💊" },
  { id: 5, name: "Giải trí", icon: "🎮" },
  { id: 6, name: "Tiết kiệm/Đầu tư", icon: "💰" },
  { id: 7, name: "Nợ", icon: "💳" },
  { id: 8, name: "Khác", icon: "🧾" },
  { id: 9, name: "Bảo hiểm", icon: "🛡️" },
  { id: 10, name: "Du lịch", icon: "✈️" },
  { id: 11, name: "Công việc/Kinh doanh", icon: "💼" },
];

export const initInitSystemMessage: ChatCompletionMessageParam = {
  role: "system",
  content: `Bạn là một trợ lý tài chính, bạn có nhiệm vụ:
  - ghi chép các giao dịch, đưa ra ý kiến về chi phí và tính toán chi tiêu. 
  - Bạn có tính cách hay châm biến và khó tính.
  - Danh sách đầy đủ: ${defaultCategory.map((item) => item.name).join(", ")}`,
};

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "add_expense",
      description:
        "Add an expense when the user provides an item and an amount (e.g., '30k cà phê', 'đi chợ 500k', '30 ngàn ăn sáng').\n" +
        "The amount can be in formats like '10k', '50 ngàn', '500k', or full numbers like '500000'.\n" +
        "Never add an expense unless the item name and amount appear in the same user input.\n" +
        "Never add an expense unless the mount is not correct format\n" +
        "Extract the numeric amount and the item name. Always assign a category based on known mappings.\n" +
        "If an item isn't in the mapping, assign 'Khác'.\n" +
        "Examples:\n" +
        "- '50k ăn sáng' → item: 'ăn sáng', amount: 50000, category: 'Ăn uống'\n" +
        "- '200k xăng' → item: 'xăng', amount: 200000, category: 'Giao thông'\n" +
        "- '10k nước' → item: 'nước', amount: 10000, category: 'Khác'\n",
      parameters: {
        type: "object",
        properties: {
          item: { type: "string", description: "The name of the item." },
          amount: {
            type: "number",
            description:
              "The cost of the item in Vietnam dong. Example: '30k' = 30000.",
          },
          category: {
            type: "string",
            description:
              "The category of the expense, automatically assigned based on keywords in the item name.",
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
        "Delete an expense to the user's account. Just delete when user provide fully item and amount. When user provide only item, confirm deletion.",
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
      name: "add_income",
      description:
        "Record an income when the user provides an amount and a source (e.g., 'Lương tháng 10 20 triệu', 'tiền thưởng 5 triệu', '50 triệu đầu tư').\n" +
        "The amount can be in formats like '10k', '50 ngàn', '500k', or full numbers like '500000'.\n" +
        "Never add an expense unless the item name and amount appear in the same user input.\n" +
        "Extract the numeric amount and the item name. Always assign a category based on known mappings.\n" +
        "If an item isn't in the mapping, assign 'Khác'.\n" +
        "Example mappings:\n" +
        "- 'quỹ', 'lương', 'lương tháng', 'tiền công' → 'Lương' 💼\n" +
        "- 'tiền thưởng', 'bonus' → 'Thưởng' 🎁\n" +
        "- 'đầu tư', 'cổ tức', 'chứng khoán' → 'Đầu tư' 📈\n" +
        "- 'bán hàng', 'kinh doanh', 'thu nhập thêm' → 'Kinh doanh' 🏪\n" +
        "- 'quỹ', 'tiền lãi', 'tiết kiệm' → 'Tiết kiệm/Đầu tư' 💰\n" +
        "- Anything unrecognized → 'Khác' 🧾",
      parameters: {
        type: "object",
        properties: {
          item: {
            type: "string",
            description: "The source of the income (e.g., salary, bonus).",
          },
          amount: {
            type: "number",
            description:
              "The amount of income in Vietnam dong. Example: '5 triệu' = 5000000.",
          },
          category: {
            type: "string",
            description:
              "The category of the income, always assigned based on keywords in the item name.",
          },
        },
        required: ["item", "amount"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_income",
      description:
        "Delete an income from the user's account. Just delete when user provide fully source and amount. When user provide only source, confirm deletion.",
      parameters: {
        type: "object",
        properties: {
          source: {
            type: "string",
            description: "The source of the income (e.g., salary, bonus).",
          },
          amount: {
            type: "number",
            description:
              "The amount of income in Vietnam dong. Example: '5 triệu' = 5000000.",
          },
        },
        required: ["source", "amount"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_income",
      description:
        "Calculate the total amount the user has earned based on a specified time range.",
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
