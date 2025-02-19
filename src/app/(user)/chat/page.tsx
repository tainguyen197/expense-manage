"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import React, { useTransition } from "react";
import { getExpenseParams } from "../../api/openai";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { Message as TMessage } from "../../../types/message";
import { groupMessagesByDate } from "@/utils/groupMessagesByDate";
import moment from "moment";
import Message from "./_components/Message";
import Empty from "./_components/Empty";
import UserAvatar from "./_components/UserAvatar";

type MessageState = Record<string, TMessage[]>; // group of messages

const ChatPage = () => {
  const [messages, setMessages] = React.useState<MessageState>({});
  const [isPending, startTransition] = useTransition();

  const scrollToBottom = () => {
    document.getElementById("scroll-area")?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleSubmit = async (formData: FormData) => {
    const userMessage = formData.get("content") as string;

    if (!userMessage) return;

    const today = new Date(new Date().toDateString()).getTime();
    const listDate = Object.keys(messages || {});
    const lastDate = listDate[listDate.length - 1];

    setMessages((messages) => ({
      ...messages,
      [today]: [
        ...(messages?.[lastDate] ?? []),
        { content: userMessage, role: "user" },
      ],
    }));
  };

  React.useEffect(() => {
    // initial message
    const chatHistory =
      loadDataFromLocalStorage<TMessage[]>("chat-history") ?? [];

    // group of messages
    const groupMessage = groupMessagesByDate(chatHistory);

    if (chatHistory) {
      setMessages(groupMessage);

      setTimeout(() => {
        document.getElementById("scroll-area")?.scrollIntoView({
          block: "end",
        });
      }, 100);
    }
  }, []);

  React.useEffect(() => {
    // get response from OpenAI with last content
    const listDate = Object.keys(messages || {});

    if (listDate.length > 0) {
      const lastDate = listDate[listDate.length - 1];
      const lastMessage = messages?.[lastDate][messages?.[lastDate].length - 1];

      // get expense parameters
      startTransition(async () => {
        if (lastMessage?.content && lastMessage?.role === "user") {
          const response = await getExpenseParams(lastMessage.content, {});
          setTimeout(scrollToBottom, 100);
          setMessages((messages) => ({
            ...messages,
            [Number(lastDate)]: [
              ...(messages?.[lastDate] ?? []),
              {
                content: response.content,
                role: "assistant",
                kind: response.kind,
              },
            ],
          }));
        }
      });
    }
  }, [messages]);

  React.useEffect(() => {
    if (isPending) {
      const timeoutId = setTimeout(scrollToBottom, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isPending]);

  React.useEffect(() => {
    if (window) {
      const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      };
      setVh();
      window.addEventListener("resize", setVh);
      return () => window.removeEventListener("resize", setVh);
    }
  }, []);

  return (
    <Card className="shadow-none border-none bg-background ">
      <CardContent
        className="mt-16 mb-40 p-3 py-0 pt-4  overflow-y-auto"
        style={{ height: "calc(var(--vh, 1vh) * 100 - 12rem)" }}
      >
        <div className="flex flex-col gap-4" id="scroll-area">
          {Object.keys(messages ?? {}).length ? (
            <div className="flex flex-col gap-4">
              {Object.keys(messages ?? {}).map((date, index) => (
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
                    {messages?.[date].map((content, index) => (
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
              {isPending ? (
                <span className="text-sm transform-all animate-typing text-accent p-2 rounded-lg">
                  ✨ Đang suy nghĩ ...
                </span>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 w-screen bg-white z-10 fixed bottom-16 gap-1 rounded-t-2xl">
        <form className="flex items-center w-full px-0 pt-0 gap-3">
          <Input
            name="content"
            className="rounded-full text-accent"
            id="content"
            placeholder="50k trà sữa ..."
          />
          <Button
            className="px-4 [&_svg]:size-6 text-primary-foreground bg-cta-button-background"
            type="submit"
            formAction={handleSubmit}
          >
            <SendHorizontal size={32} strokeWidth={1.5} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatPage;
