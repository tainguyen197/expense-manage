import { ExpenseWithoutCategory, Income } from "@/types/expense";
import Item from "./Item";
import { useRouter, useSearchParams } from "next/navigation";
import {
  deleteIncome,
  getIncomeHistoryByDate,
  updateIncome,
} from "@/app/api/income-manage";
import { getIconCategoryByName } from "@/utils/getIconCategoryByName";
import Empty from "../Empty";
import { useToast } from "@/hooks/use-toast";

const IncomeList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const incomeList = getIncomeHistoryByDate(searchParams.get("date") || "");
  const { toast } = useToast();

  const incomeListWithCategory = incomeList.map((item) => {
    const category = getIconCategoryByName(item.category);
    return {
      ...item,
      category: category,
    };
  });

  const handleDelete = (item: ExpenseWithoutCategory) => {
    const isDeleted = deleteIncome(item);
    toast({
      duration: 1000,
      variant: isDeleted ? "success" : "error",
      description: isDeleted ? "Income deleted" : "Failed to delete income",
    });
    router.refresh();
  };

  const handleEdit = (item: ExpenseWithoutCategory) => {
    const isUpdate = updateIncome(item);

    toast({
      duration: 1000,
      variant: isUpdate ? "success" : "error",
      description: isUpdate ? "Out updated" : "Failed to update out",
    });
    router.refresh();
  };

  return incomeList.length === 0 ? (
    <Empty />
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {incomeListWithCategory.map((item) => (
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

export default IncomeList;
