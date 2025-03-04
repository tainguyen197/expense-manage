import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import get from "lodash/get";
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";
import { calculateSpent } from "./expense-manage";
import {
  defaultCategory,
  defaultErrorMessage,
  initInitSystemMessage,
  tools,
} from "./prompt";
import { addIncome, calculateIncome, deleteIncome } from "./income-manage";
import { Message, MessageKind } from "@/types/message";
import { getMessagesByDate } from "@/utils/groupMessagesByDate";
import { addMessage } from "./message";
import { createExpense, deleteExpense } from "@/actions/expense";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  timestamp: number;
};

const testFunction = async ({ message }: { message: string }) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a financial assistant. Provide opinions on costs, track expenses, and calculate spending.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.choices[0].message.content ?? defaultErrorMessage;
};

export const testFunctionWithDelay = async ({
  message,
}: {
  message: string;
}) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(testFunction({ message })), 1000);
  });
};

const openaiCalling = async (message: string) => {
  const chatHistory =
    loadDataFromLocalStorage<ChatMessage[]>("chat-history") || [];

  //filter chat history by today
  const today = new Date().toDateString();
  const todayMessages = getMessagesByDate(
    chatHistory,
    new Date(today).getTime().toString()
  ) as ChatCompletionMessageParam[];

  return await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      initInitSystemMessage,
      ...todayMessages,
      {
        role: "user",
        content: message,
      },
    ],
    tools,
  });
};

const handleToolCall = async (
  toolCall: any,
  toolCallArguments: any,
  userTime: number
) => {
  let toolResponse: {
    tool_call_id: string;
    content: string;
    kind: MessageKind;
    params?: any;
  } | null = null;

  switch (toolCall.function.name) {
    case "add_expense":
      const result = await createExpense({
        ...toolCallArguments,
        timestamp: new Date(userTime),
      });

      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify({
          success: result.success,
          message: result.success ? "added" : result.message,
          category: toolCallArguments.category,
        }),
        kind: result.success ? "add_expense" : "default",
        params: {
          category: toolCallArguments.category,
          amount: toolCallArguments.amount,
          item: toolCallArguments.item,
        },
      };
      break;
    case "delete_expense": {
      const itemDeleted = await deleteExpense(toolCallArguments);
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify(itemDeleted),
        kind: "delete_expense",
      };
      break;
    }
    case "add_income": {
      const { success, message } = addIncome({
        ...toolCallArguments,
        timestamp: userTime,
      });
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify({
          success: success,
          message: success ? "added" : message,
          category: toolCallArguments.category,
        }),
        kind: "add_income",
        params: {
          category: toolCallArguments.category,
          amount: toolCallArguments.amount,
          item: toolCallArguments.item,
        },
      };
      break;
    }
    case "delete_income": {
      const itemDeleted = deleteIncome(toolCallArguments);
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify(itemDeleted),
        kind: "delete_income",
      };
      break;
    }
    case "calculate_income":
      console.log("calculating income");
      const incomeData = calculateIncome({
        // range: toolCallArguments.range,
        start_date: toolCallArguments.start_date,
        end_date: toolCallArguments.end_date,
      });

      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify(incomeData),
        kind: "calculate_income",
      };
      break;
    case "calculate_spent":
      console.log("calculating spent");
      const spentData = calculateSpent({
        range: toolCallArguments.range,
        start_date: toolCallArguments.start_date,
        end_date: toolCallArguments.end_date,
      });

      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify(spentData),
        kind: "calculate_expense",
      };
      break;
    default:
      break;
  }

  return toolResponse;
};

export const getExpenseParams = async (
  message: string,
  { timestamp = new Date().getTime(), persistStorage = true }
) => {
  const userTime = timestamp;
  const completion = await openaiCalling(message);
  const toolCall = get(completion, "choices[0].message.tool_calls[0]");

  // if no tool call, return normal response
  if (!toolCall) {
    const normalResponse = get(completion, "choices[0].message.content");

    const newMessage: Message = {
      role: "assistant",
      content: normalResponse,
      timestamp: new Date().getTime(),
      kind: "default",
    };

    persistStorage &&
      addMessage({
        role: "user",
        content: message,
        timestamp: userTime,
      });
    persistStorage && addMessage(newMessage);

    return newMessage;
  }

  const toolResponse = await handleToolCall(
    toolCall,
    JSON.parse(toolCall.function.arguments),
    userTime
  );

  const messageList = [
    {
      role: "user",
      content: message,
    },
    {
      role: "assistant",
      tool_calls: [toolCall],
    },
    toolResponse && {
      role: "tool",
      tool_call_id: toolResponse.tool_call_id,
      content: toolResponse.content,
    },
  ].filter(Boolean) as ChatCompletionMessageParam[];

  if (!toolResponse)
    return {
      role: "assistant",
      content: "Úi, mình không hiểu ý bạn lắm, bạn có thể nói rõ hơn không?",
      timestamp: timestamp,
      kind: "default" as MessageKind,
      params: {},
    };

  const completion2 = await openai.chat.completions.create({
    tools,
    model: "gpt-4o-mini",
    messages: [initInitSystemMessage, ...messageList],
  });

  const response2 =
    completion2.choices[0].message.content ?? defaultErrorMessage;

  const newMessage: Message = {
    role: "assistant",
    content: response2,
    timestamp,
    kind: toolResponse.kind,
    params: toolResponse.params,
  };

  persistStorage && addMessage({ role: "user", content: message, timestamp });
  persistStorage && addMessage(newMessage);

  return newMessage;
};

const init = () => {
  console.log("initiating...");

  if (!loadDataFromLocalStorage("chat-history")) {
    saveDataToLocalStorage("chat-history", []);
  }

  if (!loadDataFromLocalStorage("expense-history")) {
    saveDataToLocalStorage("expense-history", []);
  }

  if (!loadDataFromLocalStorage("category")) {
    saveDataToLocalStorage("category", defaultCategory);
  }

  if (!loadDataFromLocalStorage("income-history")) {
    saveDataToLocalStorage("income-history", []);
  }
};

init();
