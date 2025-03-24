import { Badge } from "@/components/ui/badge";
import { kindToMessage } from "../_utils/kindToMessage";
import { MessageKind } from "@/types/message";
import { cn } from "@/lib/utils";

// Assuming this function exists in your codebase
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
  const { content, isSender, kind, params } = expense;
  const kindObj = kind ? kindToMessage(kind) : null;

  const getMessageStyle = () => {
    if (isSender) {
      return "bg-indigo-500 text-white ml-auto rounded-br-none";
    }

    switch (kind) {
      case "add_expense":
        return "bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20 border-l-4 border-l-rose-400 dark:border-l-rose-600 text-gray-900 dark:text-gray-100";
      case "add_income":
        return "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-l-emerald-400 dark:border-l-emerald-600 text-gray-900 dark:text-gray-100";
      default:
        return "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
    }
  };

  const getBadgeStyle = () => {
    if (isSender) {
      return "bg-white/20 text-white";
    }

    switch (kind) {
      case "add_expense":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300";
      case "add_income":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div
      className={cn(
        "relative px-4 py-3 rounded-2xl text-sm shadow-sm",
        "transform transition-all duration-200",
        "max-w-[85%]",
        getMessageStyle(),
        className
      )}
    >
      {kindObj && (
        <Badge
          className={cn(
            "absolute -top-2 left-2 px-2 py-0.5 text-xs",
            getBadgeStyle()
          )}
          variant={kindObj.variant as any}
        >
          {kindObj.message}
        </Badge>
      )}
      <div className="prose dark:prose-invert max-w-none">{content}</div>
    </div>
  );
}
