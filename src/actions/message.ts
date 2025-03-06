import { createMessage, getMessageHistory } from "@/db/message-history";
import { Message } from "@/types/message";

async function addMessage(message: Message) {
  // const { userId } = await auth();
  const userId = "mock_user";

  return createMessage(message, userId);
}

async function getMessages() {
  // const { userId } = await auth();
  const userId = "mock_user";

  return getMessageHistory(userId, { limit: 10 });
}

async function addMessageWithAI(message: Message) {
  // const { userId } = await auth();
  const userId = "mock_user";

  return createMessage(message, userId);
}

export { addMessage, getMessages };
