import { Category } from "@/types/category";
import { Expense, Income } from "@/types/expense";

// function list expenseMonth by category
export const transactionMonthByCategory = (
  transactionList: Expense[] | Income[]
) => {
  const transactionByCategory = new Map<string, number>();

  transactionList.forEach((trans) => {
    const currentAmount = transactionByCategory.get(trans.category) ?? 0;
    transactionByCategory.set(trans.category, currentAmount + trans.amount);
  });

  return transactionByCategory;
};

export const mappingCategory = (
  expenseByCategory: Map<string, number>,
  category: Category[]
) => {
  const data = category.map((item) => {
    const total = expenseByCategory.get(item.id) ?? 0;
    return {
      icon: item.icon,
      category: item.name,
      id: item.id,
      total,
    };
  });

  return data;
};

export const convertArrayToObject = (
  data: {
    icon: string;
    category: string;
    id: string;
    total: number;
  }[]
): Record<string, number> => {
  return data.reduce((acc, item) => {
    acc[item.id.toString()] = item.total;
    return acc;
  }, {} as Record<string, number>);
};
