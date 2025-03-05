"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CupSoda, Plus, WalletMinimal } from "lucide-react";
import React from "react";
import IncomeList from "./Income";
import OutcomeList from "./Outcome";
import { Button } from "@/components/ui/button";
import AddNew from "./AddNew";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";

export function StaticsTab() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const tabUrl = searchParams.get("tab") ?? "outcome";

  const handleTabChange = (value: string) => {
    updateSearchParams({ tab: value });
  };

  return (
    <Tabs
      onValueChange={handleTabChange}
      value={tabUrl}
      className="p-2 bg-background rounded-tl-2xl rounded-tr-2xl w-full"
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
        <div className="">
          <OutcomeList />
          <AddNew
            type="add_expense"
            trigger={
              <div className="fixed bottom-20 right-4">
                <Button
                  size={"icon"}
                  className="bg-accent text-white rounded-full p-7"
                >
                  <Plus size={36} />
                </Button>
              </div>
            }
          />
        </div>
      </TabsContent>
      <TabsContent value="income">
        <IncomeList />
        <AddNew
          type="add_income"
          trigger={
            <div className="fixed bottom-20 right-4">
              <Button
                size={"icon"}
                className="bg-accent text-white rounded-full p-7"
              >
                <Plus size={36} />
              </Button>
            </div>
          }
        />
      </TabsContent>
    </Tabs>
  );
}
