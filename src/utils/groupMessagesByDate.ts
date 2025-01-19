import { Message } from "@/types/message";

export const groupMessagesByDate = (messages: Message[]) => {
  return messages.reduce((acc, message) => {
    const date = new Date(message.timestamp || Date.now()).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, Message[]>);
};
