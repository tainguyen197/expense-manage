"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Message } from "@/types/message";
import AddMessageForm from "./AddMessageForm";
import { interactWithAIAction } from "@/actions/ai";
import MessageList from "./MessageList";
import Header from "./Header";
import { flushSync } from "react-dom";

type MessageProps = {
  messages: Message[];
};

const ChatPage = ({ messages: messagesProp }: MessageProps) => {
  const [messages, setMessages] = React.useState<Message[]>(messagesProp);

  const scrollToBottom = () => {
    document.getElementById("scroll-area")?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

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

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className="shadow-none border-none bg-gray-10">
      <CardHeader className="shadow-gray-100 shadow-lg py-3 fixed top-0 w-screen bg-white z-10 rounded-b-2xl">
        <CardTitle className="flex justify-between">
          <Header />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="p-3 pt-16 pb-32 overflow-y-auto"
          style={{ height: "calc(100% - 120px)" }}
          id="scroll-area"
        >
          <MessageList messages={messages} />
        </div>
      </CardContent>
      <CardFooter className="p-3 w-screen z-10 fixed bottom-16 gap-1 rounded-t-2xl">
        <AddMessageForm onSubmit={handleSubmit} />
      </CardFooter>
    </Card>
  );
};

export default ChatPage;
