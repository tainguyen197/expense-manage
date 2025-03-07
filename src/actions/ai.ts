"use server";

import { interactWithAI } from "@/db/open-ai";
import { Message } from "@/types/message";
import { auth } from "@clerk/nextjs/server";

const interactWithAIAction = async (
  message: Message,
  persistStorage = true
) => {
  const { userId } = await auth();

  return interactWithAI(message, userId!, persistStorage);
};

export { interactWithAIAction };
