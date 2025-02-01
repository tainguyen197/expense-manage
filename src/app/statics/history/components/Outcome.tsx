import { NotepadTextDashed } from "lucide-react";
import Item from "./Item";
import { useSearchParams } from "next/navigation";
import { getExpenseHistoryByDate } from "@/app/api/expense-manage";
import { getIconCategoryByName } from "@/utils/getIconCategoryByName";
import Empty from "./Empty";

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

  return expenseList.length === 0 ? (
    <Empty />
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {expenseListWithCategory.map((item) => (
        <Item {...item} key={item.timestamp} />
      ))}
    </div>
  );
};

export default OutcomeList;
