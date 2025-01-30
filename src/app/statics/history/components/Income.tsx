import { Income } from "@/types/expense";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { NotepadTextDashed, ReceiptText, WalletMinimal } from "lucide-react";
import Item from "./Item";
import { useSearchParams } from "next/navigation";
import { getIncomeHistoryByDate } from "@/app/api/income-manage";

const IncomeList = () => {
  const searchParams = useSearchParams();
  const incomeList = getIncomeHistoryByDate(searchParams.get("date") || "");

  return incomeList.length === 0 ? (
    <div className="flex flex-col items-center justify-center pt-20 transition-all animate-fadeIn">
      <NotepadTextDashed color="#6b7280" size={64} strokeWidth={1} />
      <p className="text-gray-500 mt-4 text-sm">{"No income found 🙄"}</p>
    </div>
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {incomeList.map((item) => (
        <Item item={item} key={item.timestamp} />
      ))}
    </div>
  );
};

export default IncomeList;
