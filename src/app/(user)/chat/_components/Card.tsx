import { cn } from "@/lib/utils";

type MessageKind = "add_expense" | "default" | "info" | string;

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
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
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
    <div
      className={cn(
        "flex flex-col animate-fade-in",
        expense.isSender ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl shadow-sm backdrop-blur-sm p-4",
          "transform transition-all duration-200 ease-out hover:scale-[1.02]",
          "hover:shadow-md",
          getCardStyle()
        )}
      >
        {kindObj && (
          <div
            className={cn(
              "inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2",
              getBadgeStyle()
            )}
          >
            {kindObj.title}
          </div>
        )}

        <p
          className={cn(
            "text-base leading-relaxed",
            expense.isSender ? "text-white" : "text-gray-700 dark:text-gray-200"
          )}
        >
          {expense.content}
        </p>
      </div>
    </div>
  );
}
