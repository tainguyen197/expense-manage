import { ExpenseWithoutCategory, Income } from "@/types/expense";
import Item from "./Item";
import { useSearchParams } from "next/navigation";
import { getIconCategoryByName } from "@/utils/getIconCategoryByName";
import Empty from "../Empty";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { deleteIncome, getIncomeByDate, updateIncome } from "@/actions/income";
import { Category } from "@/types/category";

const IncomeList = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [data, setData] = React.useState<Income[]>([]);

  const dateParams = searchParams.get("date");

  const incomeListWithCategory = data.map((item) => {
    const category = getIconCategoryByName(item.category);
    return {
      ...item,
      category: category,
    };
  });

  const handleDelete = (
    item: ExpenseWithoutCategory & {
      category: Category;
    }
  ) => {
    deleteIncome({ ...item, category: item.category.id }).then((result) => {
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.success ? "Out deleted" : "Failed to delete out",
      });
    });
  };

  const handleEdit = (item: Income) => {
    updateIncome({ ...item, category: item.category }).then((result) => {
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.success ? "Out updated" : "Failed to update out",
      });
    });
  };

  React.useEffect(() => {
    const fetchingExpenseList = async () => {
      const from = new Date(Number(dateParams));
      const to = new Date(from);

      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      const expenseList = dateParams
        ? await getIncomeByDate(from.toISOString(), to.toISOString())
        : [];
      return expenseList;
    };

    if (dateParams) {
      fetchingExpenseList().then((result) => {
        setData(result);
      });
    }
  }, [dateParams]);

  if (!incomeListWithCategory.length)
    return (
      <div className="flex flex-col gap-4 transition-all animate-fadeIn p-4">
        {[1, 2, 3].map((item) => (
          <Item.Skeleton key={item} />
        ))}
      </div>
    );

  return data.length === 0 ? (
    <Empty />
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {incomeListWithCategory.map((item) => (
        <Item
          item={item}
          onDelete={handleDelete}
          onEdit={handleEdit}
          key={item.timestamp}
        />
      ))}
    </div>
  );
};

export default IncomeList;
