import { cn } from "@/lib/utils";
import Message from "./Message";
import { MessageKind } from "@/types/message";

// Assuming this function exists in your codebase
function kindToMessage(kind: MessageKind) {
  // This is a placeholder - replace with your actual implementation
  return {
    title: kind.charAt(0).toUpperCase() + kind.slice(1).replace("_", " "),
    // Add other properties your kindToMessage function returns
  };
}

interface ExpenseCardProps {
  expense: {
    content: string | null;
    isSender?: boolean;
    kind: MessageKind | null;
    params?: any;
  };
  className?: string;
}

export function ExpenseCard({ expense, className }: ExpenseCardProps) {
  const kindObj = expense.kind ? kindToMessage(expense.kind) : null;

  const getCardStyle = () => {
    if (expense.isSender) {
      return "bg-gradient-to-br from-indigo-500 to-purple-500 text-white dark:from-indigo-600 dark:to-purple-600";
    }

    switch (expense.kind) {
      case "add_expense":
        return "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-l-emerald-400 dark:border-l-emerald-600";
      case "default":
        return "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/40";
      default:
        return "bg-white dark:bg-gray-800";
    }
  };

  const getBadgeStyle = () => {
    if (expense.isSender) {
      return "bg-white/20 text-white";
    }

    switch (expense.kind) {
      case "add_expense":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      case "default":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300";
    }
  };

  return (
    <Message
      content={expense.content}
      isSender={expense.isSender}
      kind={expense.kind}
      params={expense.params}
      className={className}
    />
  );
}
