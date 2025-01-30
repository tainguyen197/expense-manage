import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CupSoda, WalletMinimal } from "lucide-react";
import React from "react";
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
        <TabsTrigger value="outcome">
          <div className="flex gap-1">
            <CupSoda size={20} />
            <h3>Outcome</h3>
          </div>
        </TabsTrigger>
        <TabsTrigger value="income">
          <div className="flex gap-2">
            <WalletMinimal size={20} />
            <h3>Income</h3>
          </div>
        </TabsTrigger>
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
