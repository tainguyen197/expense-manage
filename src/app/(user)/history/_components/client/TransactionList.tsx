"use client";

import { Expense, Income } from "@/types/expense";
import Item from "./Item";
import Empty from "../Empty";
import React from "react";
import { Category } from "@/types/category";
import { useCategories } from "@/contexts/CategoryProvider";
type TransactionWithCategory = (Expense | Income) & {
  category: Category;
};

type TransactionListProps = {
  data: (Income | Expense)[] | null;
  onDelete: (item: TransactionWithCategory) => void;
  onEdit: (item: Income | Expense) => void;
};

const TransactionList = ({ data, onDelete, onEdit }: TransactionListProps) => {
  const { categories } = useCategories();
  const transactionsWithCategory = data
    ? data.map((item) => {
        const category = categories.find((c) => c.id === item.category);
        return {
          ...item,
          category: category,
        } as TransactionWithCategory;
      })
    : null;

  if (!data || !transactionsWithCategory)
    return (
      <div className="flex flex-col gap-4 transition-all animate-fadeIn p-4">
        {[1, 2, 3].map((item) => (
          <Item.Skeleton key={item} />
        ))}
      </div>
    );

  console.log(transactionsWithCategory);

  return data.length === 0 ? (
    <Empty />
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {transactionsWithCategory.map((item) => (
        <Item
          key={`${item.timestamp}-${item.id}`}
          transaction={item}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TransactionList;
