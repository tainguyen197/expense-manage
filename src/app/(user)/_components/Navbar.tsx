"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquareMore,
  CalendarDays,
  ChartPie,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const tabList = [
    {
      icon: <MessageSquareMore size={30} />,
      title: "Chat",
      value: "/chat",
    },
    {
      icon: <CalendarDays size={30} />,
      title: "History",
      value: "/history",
    },
    {
      icon: <ChartPie size={30} />,
      title: "Statics",
      value: "/statics",
    },
    {
      icon: <Settings size={30} />,
      title: "Settings",
      value: "/settings",
    },
  ];

  return (
    <Tabs defaultValue="/chat" className="h-16" value={pathname}>
      <TabsList className="rounded-tl-xl rounded-tr-xl  border border-solid justify-between fixed bottom-0 w-full h-16 py-2 bg-white shadow-sm shadow-gray-100">
        {tabList.map((tab) => (
          <TabsTrigger
            key={tab.value}
            className="text-muted/90 flex-col border-none item-center justify-center h-full relative rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:border-b-0"
            value={tab.value}
          >
            <Link href={tab.value} className="absolute w-full h-full" />
            {tab.icon}
            <h3 className="text-xs leading-none mt-1">{tab.title}</h3>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default Navbar;
