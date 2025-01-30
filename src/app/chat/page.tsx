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
import { Send, MessageSquareDashed, ChartNoAxesCombined } from "lucide-react";
import React from "react";
import { testFunctionWithDelay, getExpenseParams } from "../api/openai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { Message as TMessage } from "../../types/message";
import { groupMessagesByDate } from "@/utils/groupMessagesByDate";
import moment from "moment";
import Link from "next/link";
import Message from "./_components/Message";

type MessageState = Record<string, TMessage[]>; // group of messages

const ChatPage = () => {
  const [messages, setMessages] = React.useState<MessageState>();

  const handleSubmit = async (formData: FormData) => {
    const userMessage = formData.get("content") as string;

    if (!userMessage) return;

    // check if messages timestamp is the same day
    const today = new Date().toLocaleDateString();
    const listDate = Object.keys(messages || {});
    const lastDate = listDate[listDate.length - 1];

    // if last message is not today, create new group
    if (moment(lastDate).isSame(today)) {
      setMessages((messages) => ({
        ...messages,
        [lastDate]: [
          ...(messages?.[lastDate] ?? []),
          { content: userMessage, role: "user" },
        ],
      }));
    } else {
      const date = new Date(Date.now()).toLocaleDateString();

      setMessages((messages) => ({
        ...messages,
        [date]: [{ content: userMessage, role: "user" }],
      }));
    }
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

      if (lastMessage?.content && lastMessage?.role === "user") {
        // get expense parameters
        getExpenseParams(lastMessage.content).then((response) => {
          console.log("response", response);
          setMessages((messages) => ({
            ...messages,
            [lastDate]: [
              ...(messages?.[lastDate] ?? []),
              {
                content: response.content,
                role: "assistant",
                kind: response.kind,
              },
            ],
          }));
        });
      }
    }
  }, [messages]);

  return (
    <Card className="shadow-none border-none h-screen">
      <CardHeader className="shadow-gray-100 shadow-lg py-3 fixed top-0 w-screen bg-white z-10">
        <CardTitle className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src="https://scontent-hkg4-1.xx.fbcdn.net/v/t1.6435-1/180279172_1450336808642016_7562851521701070277_n.jpg?stp=c0.281.736.736a_dst-jpg_s480x480_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=VQfdvvR2ycYQ7kNvgEZv9ND&_nc_zt=24&_nc_ht=scontent-hkg4-1.xx&_nc_gid=AGDHp6bVM6djLjnpxn1kSfu&oh=00_AYBdWVgSJA9HzzB311EML8pZePlPlHGaHa1bGaJxc0Yhmg&oe=67AF3F41" />
              <AvatarFallback>KR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold leading-none">
                Nguyễn Trung Tài (Kira)
              </p>
              <p className="text-sm text-muted-foreground">
                expert_here@example.com
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center relative">
            <Link href="/statics/history">
              <ChartNoAxesCombined
                size={24}
                className="relative cursor-pointer text-blue-main"
              />
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <ScrollArea suppressHydrationWarning id="scroll-area" className="py-16">
        <CardContent className="py-0 pt-4 block">
          {Object.keys(messages ?? {}).length ? (
            <div className="flex flex-col gap-4">
              {Object.keys(messages ?? {}).map((date, index) => (
                <div key={index}>
                  <div className="text-center text-muted-foreground font-light text-sm py-2">
                    <span suppressHydrationWarning>
                      {moment(date).locale("vi").calendar(null, {
                        sameDay: "[Hôm nay]",
                        nextDay: "[Ngày mai]",
                        nextWeek: "dddd",
                        lastDay: "[Hôm qua]",
                        lastWeek: "[Tuần trước] dddd",
                        sameElse: "DD/MM/YYYY",
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
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full mt-28">
              <MessageSquareDashed
                size={84}
                strokeWidth={1}
                className="m-auto text-muted-foreground"
              />
              <span className="text-muted-foreground text-md mt-4">
                Bắt đầu cuộc trò chuyện
              </span>
            </div>
          )}
        </CardContent>
      </ScrollArea>

      <CardFooter className="shadow-gray-100 shadow-lg py-3 fixed bottom-0 w-screen bg-white z-10">
        <form className="flex items-center w-full px-0 pt-0">
          <Input
            name="content"
            className="text-sm"
            id="content"
            placeholder="50k trà sữa ..."
          />
          <Button className="ml-2" type="submit" formAction={handleSubmit}>
            <Send size={16} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatPage;
