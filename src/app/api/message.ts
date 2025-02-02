import { Message } from "@/types/message";
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";

export const addMessage = async (message: Message) => {
  const chatHistory = loadDataFromLocalStorage<Message[]>("chat-history") || [];

  saveDataToLocalStorage<Message[]>("chat-history", [
    ...(chatHistory || []),
    message,
  ]);
};
