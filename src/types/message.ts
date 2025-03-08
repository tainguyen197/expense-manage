export type MessageKind =
  | "add_expense"
  | "delete_expense"
  | "add_income"
  | "delete_income"
  | "default"
  | "calculate_income"
  | "calculate_expense";

export type Message = {
  content: string;
  role: "system" | "user" | "assistant" | "tool";
  kind: MessageKind | null;
  timestamp: string;
  params?: any;
};
