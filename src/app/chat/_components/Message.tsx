import { Badge } from "@/components/ui/badge";
import { kindToMessage } from "../_utils/kindToMessage";
import { MessageKind } from "@/types/message";

const Message = ({
  content,
  isSender = false,
  kind,
}: {
  content: string | null;
  isSender?: boolean;
  kind?: MessageKind;
}) => {
  const kindObj = kind ? kindToMessage(kind) : null;

  return (
    <div
      className={`rounded-lg px-3 py-2 text-sm transform transition-transform duration-200 hover:scale-105 ${
        isSender ? "ml-auto bg-[#41bc5b] text-primary-foreground" : "bg-muted"
      } transition-opacity duration-400 animate-fadeIn
      w-fit max-w-[70%]`}
    >
      {kindObj && (
        <Badge className="px-0 mr-1 text-xs" variant={kindObj.variant as any}>
          {kindObj.message}
        </Badge>
      )}
      {content}
    </div>
  );
};

export default Message;
