"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal, CalendarDays } from "lucide-react";
import React, { useTransition } from "react";
import { getExpenseParams } from "../../api/openai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { Message as TMessage } from "../../../types/message";
import { groupMessagesByDate } from "@/utils/groupMessagesByDate";
import moment from "moment";
import Message from "./_components/Message";
import Empty from "./_components/Empty";

type MessageState = Record<string, TMessage[]>; // group of messages

const ChatPage = () => {
  const [messages, setMessages] = React.useState<MessageState>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    const userMessage = formData.get("content") as string;

    if (!userMessage) return;

    const today = new Date(new Date().toLocaleDateString()).getTime();
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
    }

    console.log("groupMessage", groupMessage);
  }, []);

  React.useEffect(() => {
    // query ref scroll area
    document.getElementById("scroll-area")?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    // get response from OpenAI with last content
    const listDate = Object.keys(messages || {});
    if (listDate.length > 0) {
      const lastDate = listDate[listDate.length - 1];
      const lastMessage = messages?.[lastDate][messages?.[lastDate].length - 1];

      // get expense parameters
      startTransition(async () => {
        if (lastMessage?.content && lastMessage?.role === "user") {
          const response = await getExpenseParams(lastMessage.content, {});

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
      const timeoutId = setTimeout(() => {
        document.getElementById("scroll-area")?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isPending]);

  return (
    <Card className="shadow-none border-none bg-background">
      <CardHeader className="shadow-gray-100 shadow-lg py-3 fixed top-0 w-screen bg-white z-10 rounded-b-2xl">
        <CardTitle className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src="https://scontent-hkg4-1.xx.fbcdn.net/v/t1.6435-1/180279172_1450336808642016_7562851521701070277_n.jpg?stp=c0.281.736.736a_dst-jpg_s480x480_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=VQfdvvR2ycYQ7kNvgEZv9ND&_nc_zt=24&_nc_ht=scontent-hkg4-1.xx&_nc_gid=AGDHp6bVM6djLjnpxn1kSfu&oh=00_AYBdWVgSJA9HzzB311EML8pZePlPlHGaHa1bGaJxc0Yhmg&oe=67AF3F41" />
              <AvatarFallback>KR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold leading-none text-muted/90">
                Kira
              </p>
              <p className="text-sm text-muted/50">expert_here@example.com</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <ScrollArea
        suppressHydrationWarning
        id="scroll-area"
        className="pt-16 pb-32"
      >
        <CardContent className="p-3 py-0 pt-4 block">
          {Object.keys(messages ?? {}).length ? (
            <div className="flex flex-col gap-4">
              {Object.keys(messages ?? {}).map((date, index) => (
                <div key={index}>
                  <div className="text-center text-muted-foreground font-light text-sm py-2">
                    <span suppressHydrationWarning>
                      {moment(Number(date)).calendar(null, {
                        sameDay: "[Hôm nay]", // Removes the time part
                        lastDay: "[Hôm qua]",
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
        </CardContent>
      </ScrollArea>

      <CardFooter className="p-3 w-screen bg-white z-10 fixed bottom-16 gap-1 rounded-t-2xl">
        <form className="flex items-center w-full px-0 pt-0 gap-3">
          <Input
            name="content"
            className="text-xs rounded-full text-accent"
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
