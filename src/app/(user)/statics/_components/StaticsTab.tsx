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
      className=" bg-card p-2 rounded-tl-2xl rounded-tr-2xl w-full"
      onValueChange={(value) => {
        router.push(`/statics?tab=${value}`);
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="outcome">
          <div className="flex gap-1 text-primary data-[state=active]:border-b-border">
            <CupSoda size={20} />
            <h3>Outcome</h3>
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="income"
          className="flex gap-1 text-primary data-[state=active]:border-b-border"
        >
          <div className="flex gap-2">
            <WalletMinimal size={20} />
            <h3>Income</h3>
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
