import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import MonthTotal from "./MonthTotal";

const MonthStatic = ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return <MonthTotal searchParams={searchParams} />;
};

export default MonthStatic;
