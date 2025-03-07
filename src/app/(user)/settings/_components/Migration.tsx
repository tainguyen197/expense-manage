"use client";
import React from "react";
import {
  migrateChatHistory,
  migrateExpenseHistory,
  migrateIncomeHistory,
} from "../../utils/migrateData";
import { Button } from "@/components/ui/button";

const Migrating = () => {
  const [isPending, startTransition] = React.useTransition();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const handleMigrate = () => {
    startTransition(async () => {
      console.log("Migrating history...");
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      await migrateIncomeHistory();
      await migrateExpenseHistory();
      await migrateChatHistory();
      setIsSuccess(true);
      console.log("Migrating history done");
    });
  };

  return (
    <div className="w-full mt-4">
      <Button
        onClick={handleMigrate}
        disabled={isPending}
        className="w-full mb-2"
      >
        {isPending ? "Migrating data ... " : "Click here to migrate data"}
      </Button>
      {isSuccess ? <span>Process done!</span> : <></>}
    </div>
  );
};

export default Migrating;
