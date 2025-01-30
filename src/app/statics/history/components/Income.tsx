import { Income } from "@/types/expense";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { ReceiptText } from "lucide-react";
import Item from "./Item";

const IncomeList = () => {
  const incomeList = loadDataFromLocalStorage<Income[]>("income-history") || [];

  return incomeList.length === 0 ? (
    <div className="flex flex-col items-center justify-center pt-10 transition-all animate-fadeIn">
      <ReceiptText color="#6b7280" size={48} />
      <p className="text-gray-500 mt-2 text-sm">No income found</p>
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
