"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import CategoryStatic from "./CategoryStatic";
import { useRouter, useSearchParams } from "next/navigation";

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
        <TabsTrigger value="outcome">Outcome</TabsTrigger>
        <TabsTrigger value="income">Income</TabsTrigger>
      </TabsList>
      <TabsContent value="outcome">
        <CategoryStatic />
      </TabsContent>
      <TabsContent value="income">
        <CategoryStatic />
      </TabsContent>
    </Tabs>
  );
}
