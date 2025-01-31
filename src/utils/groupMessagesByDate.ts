import { Message } from "@/types/message";

export const groupMessagesByDate = (messages: Message[]) => {
  return messages.reduce((acc, message) => {
    const date = new Date(message.timestamp);
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
      .getTime()
      .toString();
    if (!acc[newDate]) {
      acc[newDate] = [];
    }
    acc[newDate].push(message);
    return acc;
  }, {} as Record<string, Message[]>);
};

export const getMessagesByDate = (messages: Message[], date: string) => {
  return messages.filter((message) => {
    const messageDate = new Date(message.timestamp);
    const startOfDate = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    ).getTime();
    return startOfDate.toString() === date;
  });
};
