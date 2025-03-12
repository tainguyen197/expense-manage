import { Suspense } from "react";
import { getMessages } from "@/actions/message";
// import ChatPage from "./_components/Page";
import Page_NEW from "./_components/Page_NEW";

const ChatPageWrapper = async () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col space-y-4 p-4">
          <div className="h-12 w-full bg-gray-800/50 animate-pulse rounded-lg" />
          <div className="h-24 w-3/4 bg-gray-800/50 animate-pulse rounded-lg" />
          <div className="h-24 w-2/3 bg-gray-800/50 animate-pulse rounded-lg" />
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
