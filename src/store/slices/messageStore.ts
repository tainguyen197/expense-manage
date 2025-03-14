import { create } from "zustand";
import { Message } from "@/types/message";
import { devtools } from "zustand/middleware";
interface MessageStore {
  messages: Message[];
  hasInitialized: boolean;
  addMessage: (message: Message) => void;
  setInitialized: (value: boolean) => void;
}

const useMessageStore = create<MessageStore>()(
  devtools(
    (set) => ({
      messages: [],
      hasInitialized: false,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setInitialized: (value) => set({ hasInitialized: value }),
    }),
    {
      name: "message-store",
    }
  )
);

export default useMessageStore;
