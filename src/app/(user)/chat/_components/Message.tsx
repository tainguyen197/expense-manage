import { Badge } from "@/components/ui/badge";
import { kindToMessage } from "../_utils/kindToMessage";
import { MessageKind } from "@/types/message";
import { cn } from "@/lib/utils";

const Message = ({
  content,
  isSender = false,
  kind,
  params,
  className,
}: {
  content: string | null;
  isSender?: boolean;
  kind: MessageKind | null;
  params?: any;
  className?: string;
}) => {
  const kindObj = kind ? kindToMessage(kind) : null;

  return (
    <div
      className={cn(
        "relative px-4 py-3 rounded-2xl text-sm shadow-sm",
        "transform transition-all duration-200",
        "max-w-[85%]",
        isSender
          ? "bg-indigo-500 text-white ml-auto rounded-br-none"
          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mr-auto rounded-bl-none",
        className
      )}
    >
      {kindObj && (
        <Badge
          className={cn(
            "absolute -top-2 left-2 px-2 py-0.5 text-xs",
            isSender ? "bg-indigo-600" : "bg-gray-100 dark:bg-gray-700"
          )}
          variant={kindObj.variant as any}
        >
          {kindObj.message}
        </Badge>
      )}
      <div className="prose dark:prose-invert max-w-none">{content}</div>
    </div>
  );
};

export default Message;
