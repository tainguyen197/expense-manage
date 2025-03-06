"use server";

import { interactWithAI } from "@/db/open-ai";
import { Message } from "@/types/message";

const interactWithAIAction = async (message: Message) => {
  // const { userId } = await auth();
  const userId = "mock_user";

  return interactWithAI(message, userId);
};

export { interactWithAIAction };
