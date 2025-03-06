import { getMessages } from "@/actions/message";
import ChatPage from "./_components/Page";

const ChatPageWrapper = async () => {
  const [messages] = await Promise.all([getMessages()]);

  return <ChatPage messages={messages} />;
};

export default ChatPageWrapper;
