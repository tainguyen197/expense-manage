import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptText } from "lucide-react";
import { Chart } from "./Chart";
import React from "react";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { Expense } from "@/types/expense";
import Item from "../history/components/Item";
import IncomeList from "../history/components/Income";
import OutcomeList from "../history/components/Outcome";

type StaticsTabProps = {
  defaultTab?: string;
  onTabChange?: (value: string) => void;
};

export function StaticsTab({
  defaultTab = "outcome",
  onTabChange,
}: StaticsTabProps) {
  return (
    <Tabs
      onValueChange={onTabChange}
      defaultValue={defaultTab}
      className=" bg-card p-2 rounded-tl-2xl rounded-tr-2xl w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="outcome">Spends</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
      </TabsList>
      <TabsContent value="outcome">
        <OutcomeList />
      </TabsContent>
      <TabsContent value="income">
        <IncomeList />
      </TabsContent>
    </Tabs>
  );
}
