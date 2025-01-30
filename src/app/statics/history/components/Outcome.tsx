import { Income } from "@/types/expense";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { ReceiptText } from "lucide-react";
import Item from "./Item";

const OutcomeList = () => {
  const expenseList =
    loadDataFromLocalStorage<Income[]>("expense-history") || [];

  return expenseList.length === 0 ? (
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
  );
};

export default OutcomeList;
