import { Income } from "@/types/expense";
import { loadDataFromLocalStorage } from "@/utils/localStorage";
import { NotepadTextDashed, ReceiptText, WalletMinimal } from "lucide-react";
import Item from "./Item";
import { useSearchParams } from "next/navigation";
import { getIncomeHistoryByDate } from "@/app/api/income-manage";
import { getIconCategoryByName } from "@/utils/getIconCategoryByName";
import Empty from "./Empty";

const IncomeList = () => {
  const searchParams = useSearchParams();
  const incomeList = getIncomeHistoryByDate(searchParams.get("date") || "");

  const incomeListWithCategory = incomeList.map((item) => {
    const category = getIconCategoryByName(item.category) ?? "__";
    return {
      ...item,
      category: category,
    };
  });

  return incomeList.length === 0 ? (
    <Empty />
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {incomeListWithCategory.map((item) => (
        <Item item={item} key={item.timestamp} />
      ))}
    </div>
  );
};

export default IncomeList;
