"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  MessageSquareDashed,
  ChartNoAxesCombined,
  MessageSquareMore,
  CalendarDays,
  ChartPie,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <Tabs defaultValue="/chat" className="h-16" value={pathname}>
      <TabsList className="fixed bottom-0 w-full h-16 py-2 bg-white shadow-sm ">
        <TabsTrigger
          className="flex-col border-none item-center justify-center h-full relative rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:border-none  data-[state=active]:text-[#f13ebb]"
          value="/chat"
        >
          <Link href="/chat" className="absolute w-full h-full" />
          <MessageSquareMore size={20} />
          <h3 className="text-xs leading-none mt-1">Chat</h3>
        </TabsTrigger>
        <TabsTrigger
          className="flex-col border-none item-center justify-center h-full relative rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:border-none"
          value="/history"
        >
          <Link href="/history" className="absolute w-full h-full" />
          <CalendarDays size={20} />
          <h3 className="text-xs leading-none mt-1">History</h3>
        </TabsTrigger>
        <TabsTrigger
          className="flex-col border-none item-center justify-center h-full relative rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:border-none"
          value="abc"
        >
          <Link href="/chat" className="absolute w-full h-full" />
          <ChartPie size={20} />
          <h3 className="text-xs leading-none mt-1">Statics</h3>
        </TabsTrigger>
        <TabsTrigger
          className="flex-col border-none item-center justify-center h-full relative rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:border-none"
          value="nana"
        >
          <Link href="/chat" className="absolute w-full h-full" />
          <Settings size={20} />
          <h3 className="text-xs leading-none mt-1">Settings</h3>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default Navbar;
