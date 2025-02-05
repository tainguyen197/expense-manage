const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div id="chat-layout" className="flex flex-col h-screen">
      {children}
    </div>
  );
};
export default ChatLayout;
