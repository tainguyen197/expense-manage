import React from "react";
import Item from "./Item";
import Empty from "../Empty";

import { useSearchParams } from "next/navigation";
import { getIconCategoryByName } from "@/utils/getIconCategoryByName";
import { Expense, ExpenseWithoutCategory } from "@/types/expense";
import { useToast } from "@/hooks/use-toast";
import {
  deleteExpense,
  getExpenseByDate,
  updateExpense,
} from "@/actions/expense";
import { Category } from "@/types/category";

const OutcomeList = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [data, setData] = React.useState<Expense[] | null>(null);

  const dateParams = searchParams.get("date");

  //TODO: move to server
  const expenseListWithCategory = data
    ? data?.map((item) => {
        const category = getIconCategoryByName(item.category);
        return {
          ...item,
          category: category,
        };
      })
    : null;

  const handleDelete = (
    item: ExpenseWithoutCategory & {
      category: Category;
    }
  ) => {
    deleteExpense({ ...item, category: item.category.id }).then((result) => {
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.message,
      });
    });
  };

  const handleEdit = (item: Expense) => {
    updateExpense({ ...item, category: item.category }).then((result) => {
      toast({
        duration: 1000,
        variant: result.success ? "success" : "error",
        description: result.message,
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
        ? await getExpenseByDate(from.toISOString(), to.toISOString())
        : [];
      return expenseList;
    };

    if (dateParams) {
      fetchingExpenseList().then((result) => {
        setData(result);
      });
    }
  }, [dateParams]);

  if (!dateParams || !expenseListWithCategory)
    return (
      <div className="flex flex-col gap-4 transition-all animate-fadeIn p-4">
        {[1, 2, 3].map((item) => (
          <Item.Skeleton key={item} />
        ))}
      </div>
    );

  if (!dateParams || !data || data.length === 0) {
    return <Empty />;
  }

  return (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {expenseListWithCategory.map((item, key) => (
        <Item
          item={item}
          onDelete={handleDelete}
          onEdit={handleEdit}
          key={key}
        />
      ))}
    </div>
  );
};

export default OutcomeList;
