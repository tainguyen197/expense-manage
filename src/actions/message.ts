"use server";

import { createMessage, getMessageHistory } from "@/db/message-history";
import { Message } from "@/types/message";
import { auth } from "@clerk/nextjs/server";

async function addMessage(message: Message) {
  const { userId } = await auth();
  return createMessage(message, userId!);
}

async function getMessages() {
  const { userId } = await auth();
  return getMessageHistory(userId!, { limit: 10 });
}

async function addMessageWithAI(message: Message) {
  const { userId } = await auth();

  return createMessage(message, userId!);
}

export async function getMessagesAction(): Promise<Message[]> {
  // Move your existing getMessages logic here
  const messages = await getMessages();
  return messages;
}

export { addMessage, getMessages };
