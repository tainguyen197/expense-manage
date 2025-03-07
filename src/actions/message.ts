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

  return getMessageHistory(userId!, { limit: 20 });
}

async function addMessageWithAI(message: Message) {
  const { userId } = await auth();

  return createMessage(message, userId!);
}

export { addMessage, getMessages };
