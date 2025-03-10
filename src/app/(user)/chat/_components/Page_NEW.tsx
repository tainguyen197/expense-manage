"use client";

import React from "react";

import { ExpenseCard } from "./Card";
import Header from "./Header";
import AddMessageForm from "./AddMessageForm";
import { Message } from "@/types/message";
import { flushSync } from "react-dom";
import { interactWithAIAction } from "@/actions/ai";
// import NavigationBar from "../../_components/Navbar";
// import { ThemeToggle } from "@/components/theme-toggle";

type MessageProps = {
  messages: Message[];
};

const ChatPage = ({ messages: messagesProp }: MessageProps) => {
  const [messages, setMessages] = React.useState<Message[]>(messagesProp);

  const handleSubmit = (data: Message) => {
    try {
      // Force immediate update
      flushSync(() => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      setTimeout(() =>
        interactWithAIAction(data).then((result) => {
          setMessages((messages) => [...messages, result]);
        })
      );
    } catch (error) {}
  };

  const scrollToBottom = () => {
    document.getElementById("scroll-area")?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col  bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-indigo-100 dark:border-gray-700 p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Header />
        </div>
      </header>
      {/* Expense List */}
      <div className="flex-1 overflow-y-auto py-6 px-4" id="scroll-area">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((expense) => (
            <ExpenseCard
              key={expense.timestamp}
              expense={{ ...expense, isSender: expense.role === "user" }}
            />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-16 pb-4 px-4">
        <AddMessageForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ChatPage;
