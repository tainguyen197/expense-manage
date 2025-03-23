import { Category } from "@/types/category";
import { Transaction } from "@/types/expense";

// function list expenseMonth by category
export const transactionMonthByCategory = (transactionList: Transaction[]) => {
  const transactionByCategory = new Map<number, number>();
  transactionList.forEach((trans) => {
    const currentAmount = transactionByCategory.get(trans.category) ?? 0;
    transactionByCategory.set(trans.category, currentAmount + trans.amount);
  });

  return transactionByCategory;
};

export const mappingCategory = (
  expenseByCategory: Map<number, number>,
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
