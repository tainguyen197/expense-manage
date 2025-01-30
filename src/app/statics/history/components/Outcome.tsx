import { NotepadTextDashed } from "lucide-react";
import Item from "./Item";
import { useSearchParams } from "next/navigation";
import { getExpenseHistoryByDate } from "@/app/api/expense-manage";
import { getIconCategoryByName } from "@/utils/getIconCategoryByName";

const OutcomeList = () => {
  const searchParams = useSearchParams();
  const expenseList = getExpenseHistoryByDate(searchParams.get("date") || "");

  const expenseListWithCategory = expenseList.map((item) => {
    const category = getIconCategoryByName(item.category);
    return {
      ...item,
      category: category,
    };
  });

  console.log("expenseList", expenseList);

  return expenseList.length === 0 ? (
    <div className="flex flex-col items-center justify-center pt-20 transition-all animate-fadeIn">
      <NotepadTextDashed color="#6b7280" size={64} strokeWidth={1} />
      <p className="text-gray-500 mt-4 text-sm">{"No outcome found 🙄"}</p>
    </div>
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {expenseListWithCategory.map((item) => (
        <Item item={item} key={item.timestamp} />
      ))}
    </div>
  );
};

export default OutcomeList;
