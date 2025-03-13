import { Suspense } from "react";
import { getMessages } from "@/actions/message";
// import ChatPage from "./_components/Page";
import Page_NEW from "./_components/Page_NEW";
import {
  HeaderSkeleton,
  MessageSkeleton,
  InputSkeleton,
} from "@/components/chat/ChatSkeleton";

const ChatPageWrapper = async () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-[100dvh]">
          <HeaderSkeleton />
          <div className="flex-1 overflow-y-auto">
            <MessageSkeleton />
            <MessageSkeleton />
          </div>
          <InputSkeleton />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
};

const ChatContent = async () => {
  const [messages] = await Promise.all([getMessages()]);
  return <Page_NEW messages={messages} />;
};

export default ChatPageWrapper;
