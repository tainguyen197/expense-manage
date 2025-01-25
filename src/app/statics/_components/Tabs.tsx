import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptText } from "lucide-react";
import { Chart } from "./Chart";
import React from "react";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { Expense } from "@/types/expense";
import Item from "../history/components/Item";

export function StaticsTab({ expenseList }: { expenseList: Expense[] }) {
  return (
    <Tabs
      defaultValue="account"
      className=" bg-card p-2 rounded-tl-2xl rounded-tr-2xl w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Spends</TabsTrigger>
        <TabsTrigger value="password">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        {expenseList.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-10 transition-all animate-fadeIn">
            <ReceiptText color="#6b7280" size={48} />
            <p className="text-gray-500 mt-2 text-sm">No expenses found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 transition-all animate-fadeIn">
            {expenseList.map((item) => (
              <Item item={item} key={item.timestamp} />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="password">
        <Chart />
      </TabsContent>
    </Tabs>
  );
}
