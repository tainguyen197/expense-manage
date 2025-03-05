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
  const searchParams = useSearchParams();
  const dateParams = searchParams.get("date");

  const { toast } = useToast();

  const [data, setData] = React.useState<Expense[]>([]);

  //TODO: move to server
  const expenseListWithCategory = data.map((item) => {
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
      const date = new Date(Number(dateParams));
      const expenseList = dateParams ? await getExpenseByDate(date, date) : [];
      return expenseList;
    };

    if (dateParams) {
      fetchingExpenseList().then((result) => {
        setData(result);
      });
    }
  }, [dateParams]);

  return data.length === 0 ? (
    <Empty />
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {expenseListWithCategory.map((item) => (
        <Item
          item={item}
          onDelete={handleDelete}
          onEdit={handleEdit}
          key={item.timestamp.getTime()}
        />
      ))}
    </div>
  );
};

export default OutcomeList;
