import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import get from "lodash/get";
import { omit } from "lodash";
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";
import { addExpense, calculateSpent, deleteExpense } from "./expense-manage";
import { defaultErrorMessage, initInitSystemMessage, tools } from "./data";

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
  const chatHistory: ChatMessage[] = loadDataFromLocalStorage("chat-history");
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
  let toolResponse: { tool_call_id: string; content: string } | null = null;

  switch (toolCall.function.name) {
    case "add_expense":
      addExpense({
        ...toolCallArguments,
        timestamp: userTime,
      });
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify({ success: true, message: "added" }),
      };
      break;
    case "delete_expense":
      const itemDeleted = deleteExpense(toolCallArguments);
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify(itemDeleted),
      };
      break;
    case "calculate_spent":
      const spentData = calculateSpent({
        range: toolCallArguments.range,
        start_date: toolCallArguments.start_date,
        end_date: toolCallArguments.end_date,
      });

      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify(spentData),
      };
      break;
    default:
      break;
  }

  return toolResponse;
};

export const getExpenseParams = async (message: string) => {
  const userTime = new Date().getTime();
  const chatHistory: ChatMessage[] = loadDataFromLocalStorage("chat-history");

  const completion = await openaiCalling(message);
  const toolCall = get(completion, "choices[0].message.tool_calls[0]");

  // if no tool call, return normal response
  if (!toolCall) {
    console.log("no tool call");
    const normalResponse = get(completion, "choices[0].message.content");

    saveDataToLocalStorage("chat-history", [
      ...chatHistory,
      {
        role: "user",
        content: message,
        timestamp: userTime,
      },
      {
        role: "assistant",
        content: normalResponse,
        timestamp: new Date().getTime(),
      },
    ]);

    return normalResponse;
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

  const completion2 = await openai.chat.completions.create({
    tools,
    model: "gpt-4o-mini",
    messages: [initInitSystemMessage, ...messageList],
  });

  const response2 =
    completion2.choices[0].message.content ?? defaultErrorMessage;

  saveDataToLocalStorage("chat-history", [
    ...chatHistory,
    {
      role: "user",
      content: message,
      timestamp: userTime,
    },
    {
      role: "assistant",
      content: response2,
      timestamp: new Date().getTime(),
    },
  ]);

  return response2;
};

const init = () => {
  console.log("initiating...");

  if (!loadDataFromLocalStorage("chat-history")) {
    saveDataToLocalStorage("chat-history", []);
  }

  if (!loadDataFromLocalStorage("expense-history")) {
    saveDataToLocalStorage("expense-history", []);
  }
};

init();
