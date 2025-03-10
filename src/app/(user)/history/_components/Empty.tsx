import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddNew from "./client/AddNew";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const Empty = () => {
  const searchParams = useSearchParams();
  const tabUrl = searchParams.get("tab") ?? "outcome";

  return (
    <div className="flex flex-col items-center justify-center space-y-6 h-[300px] mt-4">
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-200">No Records Yet</p>
        <p className="text-sm text-gray-400">
          Start tracking your {tabUrl === "income" ? "income" : "expenses"} by
          adding your first record
        </p>
      </div>

      <div
        className={cn(
          "w-24 h-1 rounded-full opacity-20",
          tabUrl === "income" ? "bg-emerald-400" : "bg-rose-400"
        )}
      />
    </div>
  );
};

export default Empty;
