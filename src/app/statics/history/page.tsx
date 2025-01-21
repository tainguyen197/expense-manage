"use client";

import React from "react";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import Calendar from "@/components/ui/calendar";
import { TabsDemo } from "../_components/Tabs";

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      email: "m@example.com",
    },
    // ...
  ];
}

export default function DemoPage() {
  const data = getData();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col items-center mx-auto container pt-2">
      {/* <DataTable columns={columns} data={data} /> */}
      <div className="flex justify-center bg-card rounded-xl shadow-lg">
        <div className="p-4 overflow-hidden">
          <Calendar />
        </div>
      </div>
      {/* show total amount */}

      <div className="flex justify-center mt-10 h-20 w-20 relative">
        <div className="absolute z-0 opacity-75 inline-flex w-full h-full bg-gray-300 rounded-full animate-ping-slow "></div>
        <div className="w-20 h-20 bg-blue-main rounded-full inline-flex relative" />
        <p className="absolute text-white text-2xl w-full h-full flex justify-center items-center font-semibold">
          5.5tr
        </p>
      </div>
      <span className="text-sm font-semibold text-balance mt-4">
        You have Spent total 60% of your budget
      </span>
      <div className="flex justify-center mt-10 w-full">
        <TabsDemo />
      </div>
    </div>
  );
}
