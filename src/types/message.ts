export type Message = {
  content: string;
  role: "system" | "user" | "assistant" | "tool";
  timestamp?: number;
};
