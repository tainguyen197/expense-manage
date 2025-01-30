export type MessageKind =
  | "add_expense"
  | "delete_expense"
  | "add_income"
  | "delete_income"
  | "default"
  | "calculate_income"
  | "calculate_expense";

export type Message = {
  content: string | null;
  role: "system" | "user" | "assistant" | "tool";
  kind?: MessageKind;
  timestamp?: number;
};
