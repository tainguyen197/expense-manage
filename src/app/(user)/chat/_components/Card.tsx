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
  // Determine the styling based on the expense type
  const kindObj = expense.kind ? kindToMessage(expense.kind) : null;

  const getCardStyle = () => {
    // If it's a sender message, use dynamic colors
    if (expense.isSender) {
      // Generate a dynamic color based on the content
      const seed = expense.content || "";
      const colorIndex =
        seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5;

      const userColors = [
        "bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-l-4 border-l-purple-400 dark:border-l-purple-600",
        "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-l-blue-400 dark:border-l-blue-600",
        "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-l-4 border-l-rose-400 dark:border-l-rose-600",
        "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-l-4 border-l-amber-400 dark:border-l-amber-600",
        "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-l-emerald-400 dark:border-l-emerald-600",
      ];

      return userColors[colorIndex];
    }

    // For system messages, use the original logic based on kind
    switch (expense.kind) {
      case "add_expense":
        return "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-l-emerald-400 dark:border-l-emerald-600";
      case "default":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-l-blue-400 dark:border-l-blue-600";
      default:
        return "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-l-4 border-l-indigo-400 dark:border-l-indigo-600";
    }
  };

  // Determine the badge style based on the expense type
  const getBadgeStyle = () => {
    // If it's a sender message, use dynamic colors
    if (expense.isSender) {
      // Generate a dynamic color based on the content
      const seed = expense.content || "";
      const colorIndex =
        seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5;

      const userBadgeColors = [
        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
        "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
        "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      ];

      return userBadgeColors[colorIndex];
    }

    // For system messages, use the original logic
    switch (expense.kind) {
      case "add_expense":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      case "default":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      default:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300";
    }
  };

  // Determine the amount badge style for params
  const getAmountStyle = () => {
    if (!expense.params?.amount) return "";

    // Generate a color based on the content
    const seed = expense.content || "";
    const colorIndex =
      seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5;

    const colorStyles = [
      "bg-gradient-to-r from-orange-100 to-amber-100 text-amber-800 dark:from-orange-900/30 dark:to-amber-900/30 dark:text-amber-300",
      "bg-gradient-to-r from-pink-100 to-rose-100 text-rose-800 dark:from-pink-900/30 dark:to-rose-900/30 dark:text-rose-300",
      "bg-gradient-to-r from-violet-100 to-purple-100 text-purple-800 dark:from-violet-900/30 dark:to-purple-900/30 dark:text-purple-300",
      "bg-gradient-to-r from-emerald-100 to-teal-100 text-teal-800 dark:from-emerald-900/30 dark:to-teal-900/30 dark:text-teal-300",
      "bg-gradient-to-r from-blue-100 to-cyan-100 text-cyan-800 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-cyan-300",
    ];

    return colorStyles[colorIndex];
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        expense.isSender ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl shadow-sm backdrop-blur-sm p-4 dark:text-white",
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

        <p className="text-gray-700 dark:text-gray-200">{expense.content}</p>
      </div>
    </div>
  );
}
