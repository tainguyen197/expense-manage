import moment from "moment";
import Empty from "./Empty";
import { Message as MessageType } from "@/types/message";
import Message from "./Message";
import { groupMessagesByDate } from "@/utils/groupMessagesByDate";

type Props = {
  messages: MessageType[];
};

const MessageList = ({ messages }: Props) => {
  // group of messages
  const groupMessage = groupMessagesByDate(messages);
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      {Object.keys(groupMessage ?? {}).length ? (
        <div className="flex flex-col gap-4">
          {Object.keys(groupMessage ?? {}).map((date, index) => (
            <div key={index}>
              <div className="text-center text-sm py-2 text-primary/90 font-semibold">
                <span suppressHydrationWarning>
                  {moment(Number(date)).calendar(null, {
                    sameDay: "[Today]", // Removes the time part
                    lastDay: "[Yesterday]",
                    lastWeek: "dddd",
                    sameElse: "MM/DD/YYYY", // Customize for older dates
                  })}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {groupMessage?.[date].map((content, index) => (
                  <Message
                    isSender={content.role === "user"}
                    key={index}
                    kind={content.kind}
                    content={content.content}
                    params={content.params}
                  />
                ))}
              </div>
            </div>
          ))}
          {/* {isPending ? (
            <span className="text-sm transform-all animate-typing text-accent p-2 rounded-lg">
              ✨ Đang suy nghĩ ...
            </span>
          ) : (
            <></>
          )} */}
        </div>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default MessageList;
