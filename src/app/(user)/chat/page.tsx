import { getMessages } from "@/actions/message";
// import ChatPage from "./_components/Page";
import Page_NEW from "./_components/Page_NEW";

const ChatPageWrapper = async () => {
  const [messages] = await Promise.all([getMessages()]);

  return <Page_NEW messages={messages} />;
};

export default ChatPageWrapper;
