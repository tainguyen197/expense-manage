const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="chat-layout" className="flex flex-col h-screen overflow-hidden">
      {children}
    </div>
  );
};
export default ChatLayout;
