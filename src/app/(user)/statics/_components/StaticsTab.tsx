"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import MonthOutCome from "./MonthOutCome";
import { useRouter, useSearchParams } from "next/navigation";
import { CupSoda, WalletMinimal } from "lucide-react";
import MonthIncome from "./MonthIncome";

export function StaticsTab() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultTab = params.get("tab") || "outcome";

  return (
    <Tabs
      defaultValue={defaultTab}
      className=" bg-card p-2 pt-0 rounded-tl-2xl rounded-tr-2xl w-full"
      onValueChange={(value) => {
        router.push(`/statics?tab=${value}`);
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="outcome">
          <div className="flex  justify-center items-center gap-1 data-[state=active]:border-b-border">
            <CupSoda size={20} />
            <h3 className="text-xs leading-none mt-1">Outcome</h3>
          </div>
        </TabsTrigger>
        <TabsTrigger value="income">
          <div className="flex justify-center items-center gap-1 data-[state=active]:border-b-border">
            <WalletMinimal size={20} />
            <h3 className="text-xs leading-none mt-1">Income</h3>
          </div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="outcome">
        <MonthOutCome />
      </TabsContent>
      <TabsContent value="income">
        <MonthIncome />
      </TabsContent>
    </Tabs>
  );
}
