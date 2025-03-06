"use server";

import { Message, MessageKind } from "@/types/message";
import get from "lodash/get";
import OpenAI from "openai";
import { createMessage, getMessagesByDate } from "./message-history";
import { defaultErrorMessage, initInitSystemMessage, tools } from "./prompt";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  calculateSpent,
  createExpense,
  deleteExpense,
} from "@/actions/expense";
import { calculateIncome, createIncome, deleteIncome } from "@/actions/income";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});

const model = "gpt-4o-mini";

const analyzeMessage = async (message: Message, userId: string) => {
  const todayMessages = await getMessagesByDate(userId, new Date(), new Date());

  const todayMessagesContent = todayMessages.map((m) => ({
    content: m.content,
    role: m.role,
  })) as ChatCompletionMessageParam[];

  return await openai.chat.completions.create({
    model,
    messages: [
      initInitSystemMessage,
      ...todayMessagesContent,
      {
        role: "user",
        content: message.content,
      },
    ],
    tools,
  });
};

const handleToolCall = async (
  toolCall: any,
  toolCallArguments: any,
  userTime: Date
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
        timestamp: userTime,
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
      const result = await createIncome({
        ...toolCallArguments,
        timestamp: userTime,
      });
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify({
          success: result.success,
          message: result.success ? "added" : result.message,
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
      const itemDeleted = await deleteIncome(toolCallArguments);
      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify(itemDeleted),
        kind: "delete_income",
      };
      break;
    }
    case "calculate_income":
      console.log("calculating income");
      const incomeData = await calculateIncome(
        // range: toolCallArguments.range,
        toolCallArguments.start_date,
        toolCallArguments.end_date
      );

      toolResponse = {
        tool_call_id: toolCall.id,
        content: JSON.stringify(incomeData),
        kind: "calculate_income",
      };
      break;
    case "calculate_spent":
      console.log("calculating spent");
      const spentData = await calculateSpent(
        toolCallArguments.start_date,
        toolCallArguments.end_date
      );

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

const interactWithAI = async (
  message: Message,
  userId: string,
  persistStorage = true
) => {
  const completion = await analyzeMessage(message, userId);
  const toolCall = get(completion, "choices[0].message.tool_calls[0]");

  // if no tool call, return normal response
  if (!toolCall) {
    const normalResponse = get(completion, "choices[0].message.content")!;

    const newMessage: Message = {
      role: "assistant",
      content: normalResponse,
      timestamp: new Date(),
      kind: "default",
    };

    persistStorage &&
      (await Promise.all([
        createMessage(message, userId),
        createMessage(newMessage, userId),
      ]));

    return newMessage;
  }

  const toolResponse = await handleToolCall(
    toolCall,
    JSON.parse(toolCall.function.arguments),
    new Date()
  );

  const messageList = [
    {
      role: "user",
      content: message.content,
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
      timestamp: new Date(),
      kind: "default" as MessageKind,
      params: {},
    } as Message;

  const completion2 = await openai.chat.completions.create({
    tools,
    model,
    messages: [initInitSystemMessage, ...messageList],
  });

  const response2 =
    completion2.choices[0].message.content ?? defaultErrorMessage;

  const newMessage: Message = {
    role: "assistant",
    content: response2,
    timestamp: new Date(),
    kind: toolResponse.kind,
    params: toolResponse.params,
  };

  persistStorage &&
    (await Promise.all([
      createMessage(message, userId),
      createMessage(newMessage, userId),
    ]));

  return newMessage;
};

export { interactWithAI };
