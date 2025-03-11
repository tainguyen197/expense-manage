"use client";

import React from "react";

import { ExpenseCard } from "./Card";
import Header from "./Header";
import AddMessageForm from "./AddMessageForm";
import { Message } from "@/types/message";
import { flushSync } from "react-dom";
import { interactWithAIAction } from "@/actions/ai";
import "./animations.css";
import NavigationBar from "../../_components/Navbar";
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
    const scrollArea = document.getElementById("scroll-area");
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen h-[100dvh] bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 px-4 py-2 bg-gray-900/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <Header />
        </div>
      </header>

      {/* Chat Messages Area */}
      <div
        className="flex-1 overflow-y-auto py-6 px-4 pb-[180px]"
        id="scroll-area"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.timestamp}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <ExpenseCard
                expense={{ ...message, isSender: message.role === "user" }}
                className={`transform transition-all duration-300 ${
                  index === messages.length - 1 ? "animate-slide-up" : ""
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-900/80 dark:to-transparent backdrop-blur-sm border-t border-indigo-100 dark:border-gray-700 pb-safe">
        <div className="max-w-4xl mx-auto p-4">
          <AddMessageForm onSubmit={handleSubmit} />
        </div>
      </div>

      {/* Navigation Bar */}
      <NavigationBar />
    </div>
  );
};

export default ChatPage;
