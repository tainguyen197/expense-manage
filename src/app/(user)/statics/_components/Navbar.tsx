import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, MessageSquareDashed, ChartNoAxesCombined } from "lucide-react";
import Link from "next/link";
import { Chart } from "./Chart";
import Calender from "@/components/ui/calendar";

const Navbar = () => {
  return (
    <Tabs defaultValue="account" className="">
      <TabsContent value="account">{/* <Calender /> */}</TabsContent>
      <TabsContent value="password">
        <Chart />
      </TabsContent>
      <TabsList className="fixed bottom-0 h-12 w-full p-0 bg-white shadow-sm border-t-[1px] border-solid border-gray-100">
        <TabsTrigger
          className="flex-1 h-full relative rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:border-none"
          value="account"
        >
          {/* <Link href="/statics" className="absolute w-full h-full" /> */}
          <Send className="pr-2" />
          Account
        </TabsTrigger>
        <TabsTrigger
          className="flex-1 h-full relative rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:border-none"
          value="password"
        >
          {/* <Link href="/statics/abc" className="absolute w-full h-full" /> */}
          <Send className="pr-2" /> Password
        </TabsTrigger>
        <TabsTrigger
          className="relative flex-1 h-full rounded-none shadow-none data-[state=active]:shadow-none data-[state=active]:border-none"
          value="password1"
        >
          <Link href="/statics/history" className="absolute w-full h-full" />
          <Send className="pr-2" /> Log
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default Navbar;
