import { NotepadTextDashed } from "lucide-react";
import Item from "./Item";
import { useSearchParams } from "next/navigation";
import {
  deleteExpense,
  getExpenseHistoryByDate,
  updateExpense,
} from "@/app/api/expense-manage";
import { getIconCategoryByName } from "@/utils/getIconCategoryByName";
import Empty from "./Empty";
import { ExpenseWithoutCategory } from "@/types/expense";
import { useToast } from "@/hooks/use-toast";

const OutcomeList = () => {
  const searchParams = useSearchParams();
  const expenseList = getExpenseHistoryByDate(searchParams.get("date") || "");
  const { toast } = useToast();

  const expenseListWithCategory = expenseList.map((item) => {
    const category = getIconCategoryByName(item.category);
    return {
      ...item,
      category: category,
    };
  });

  const handleDelete = (item: ExpenseWithoutCategory) => {
    const isDeleted = deleteExpense(item);
    toast({
      duration: 1000,
      variant: isDeleted ? "success" : "error",
      description: isDeleted ? "Outcome deleted" : "Failed to delete outcome",
    });
  };

  const handleEdit = (item: ExpenseWithoutCategory) => {
    const isUpdate = updateExpense(item);

    toast({
      duration: 1000,
      variant: isUpdate ? "success" : "error",
      description: isUpdate ? "Out updated" : "Failed to update out",
    });
  };

  return expenseList.length === 0 ? (
    <Empty />
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {expenseListWithCategory.map((item) => (
        <Item
          {...item}
          onDelete={handleDelete}
          onEdit={handleEdit}
          key={item.timestamp}
        />
      ))}
    </div>
  );
};

export default OutcomeList;
