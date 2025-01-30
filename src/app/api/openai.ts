import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import get from "lodash/get";
import { omit } from "lodash";
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";
import { addExpense, calculateSpent, deleteExpense } from "./expense-manage";
import {
  defaultCategory,
  defaultErrorMessage,
  initInitSystemMessage,
  tools,
} from "./prompt";
import { addIncome, calculateIncome, deleteIncome } from "./income-manage";
import { Message, MessageKind } from "@/types/message";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  timestamp?: number;
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
  const chatHistory = loadDataFromLocalStorage<ChatMessage[]>("chat-history");
  const chatHistoryMessages = chatHistory?.map((message) =>
    omit(message, "timestamp")
  ) as ChatCompletionMessageParam[];

  return await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      initInitSystemMessage,
      ...chatHistoryMessages,
      {
        role: "user",
        content: message,
      },
    ],
    tools,
  });
};

const handleToolCall = (
  toolCall: any,
  toolCallArguments: any,
  userTime: number
) => {
  let toolResponse: {
    tool_call_id: string;
    content: string;
    kind: MessageKind;
  } | null = null;

  switch (toolCall.function.name) {
    case "add_expense":
      addExpense({
        ...toolCallArguments,
        timestamp: userTime,
      });
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify({
          success: true,
          message: "added",
          category: toolCallArguments.category,
        }),
        kind: "add_expense",
      };
      break;
    case "delete_expense": {
      const itemDeleted = deleteExpense(toolCallArguments);
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify(itemDeleted),
        kind: "delete_expense",
      };
      break;
    }
    case "add_income":
      addIncome({
        ...toolCallArguments,
        timestamp: userTime,
      });
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify({
          success: true,
          message: "added",
          category: toolCallArguments.category,
        }),
        kind: "add_income",
      };
      break;
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
        range: toolCallArguments.range,
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

export const getExpenseParams = async (message: string) => {
  const userTime = new Date().getTime();
  const chatHistory =
    loadDataFromLocalStorage<ChatMessage[]>("chat-history") || [];

  const completion = await openaiCalling(message);

  const toolCall = get(completion, "choices[0].message.tool_calls[0]");

  // if no tool call, return normal response

  if (!toolCall) {
    console.log("no tool call");
    const normalResponse = get(completion, "choices[0].message.content");

    saveDataToLocalStorage<Message[]>("chat-history", [
      ...(chatHistory || []),
      {
        role: "user",
        content: message,
        timestamp: userTime,
      },
      {
        role: "assistant",
        content: normalResponse,
        timestamp: new Date().getTime(),
        kind: "default",
      },
    ]);

    return {
      role: "assistant",
      content: normalResponse,
      timestamp: new Date().getTime(),
      kind: "default" as MessageKind,
    };
  }

  const toolResponse = handleToolCall(
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
      timestamp: new Date().getTime(),
      kind: "default" as MessageKind,
    };

  const completion2 = await openai.chat.completions.create({
    tools,
    model: "gpt-4o-mini",
    messages: [initInitSystemMessage, ...messageList],
  });

  const response2 =
    completion2.choices[0].message.content ?? defaultErrorMessage;

  saveDataToLocalStorage<Message[]>("chat-history", [
    ...chatHistory,
    {
      role: "user",
      content: message,
      timestamp: userTime,
    },
    {
      role: "assistant",
      content: response2,
      kind: toolResponse.kind,
      timestamp: new Date().getTime(),
    },
  ]);

  return {
    role: "assistant",
    content: response2,
    kind: toolResponse?.kind,
    timestamp: new Date().getTime(),
  };
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
