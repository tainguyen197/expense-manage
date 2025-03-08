import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import MonthTotal from "./MonthTotal";
import MonthPicker from "./MonthPicker";

const MonthStatic = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <Card>
      <CardHeader>
        <MonthPicker />
      </CardHeader>
      <CardContent>
        <MonthTotal searchParams={searchParams} />
      </CardContent>
    </Card>
  );
};

export default MonthStatic;
