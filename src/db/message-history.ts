"use server";

import { Message } from "@/types/message";
import { chatHistory } from "./schema";
import { db } from "@/db";
import { asc, desc } from "drizzle-orm";

// get message history
const getMessageHistory = async (
  userId: string,
  { limit = 100 }
): Promise<Message[]> => {
  return getMessageHistoryInternal(userId, { limit });
};

const getMessageHistoryInternal = async (
  user_id: string,
  { limit }: { limit: number }
): Promise<Message[]> => {
  const messages = await db.query.chatHistory.findMany({
    where: ({ userId }, { eq }) => eq(userId, user_id),
    orderBy: [desc(chatHistory.timestamp)],
    limit,
  });

  return messages.reverse();
};

const getMessagesByDate = async (userId: string, from: string, to: string) => {
  return getMessagesByDateInternal(userId, from, to);
};

const getMessagesByDateInternal = async (
  user_id: string,
  from: string,
  to: string
) => {
  // from.setHours(0, 0, 0, 0); // Set to 00:00:00
  // to.setHours(23, 59, 59, 999); // Set to 23:59:59

  return db.query.chatHistory.findMany({
    where: ({ userId, timestamp }, { and, eq, gte, lt }) =>
      and(eq(userId, user_id), gte(timestamp, from), lt(timestamp, to)),
  });
};

const createMessage = async (message: Message, userId: string) => {
  return createMessageInternal(message, userId);
};

const createMessageInternal = async (message: Message, userId: string) => {
  if (message.content === null) {
    throw new Error("Message content cannot be null");
  }
  return db
    .insert(chatHistory)
    .values({
      ...message,
      userId,
    })
    .returning({ id: chatHistory.id });
};

export { getMessageHistory, getMessagesByDate, createMessage };
