"use client";

import { Expense, Income } from "@/types/expense";
import Item from "./Item";
import { getIconCategoryByName } from "@/utils/getIconCategoryByName";
import Empty from "../Empty";
import React from "react";
import { Category } from "@/types/category";

type TransactionWithCategory = (Expense | Income) & {
  category: Category;
};

type TransactionListProps = {
  data: (Income | Expense)[] | null;
  onDelete: (item: TransactionWithCategory) => void;
  onEdit: (item: Income | Expense) => void;
};

const TransactionList = ({ data, onDelete, onEdit }: TransactionListProps) => {
  const transactionsWithCategory = data
    ? data.map((item) => {
        const category = getIconCategoryByName(item.category);
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

  return data.length === 0 ? (
    <Empty />
  ) : (
    <div className="flex flex-col gap-1 transition-all animate-fadeIn">
      {transactionsWithCategory.map((item) => (
        <Item
          item={item}
          onDelete={onDelete}
          onEdit={onEdit}
          key={item.timestamp}
        />
      ))}
    </div>
  );
};

export default TransactionList;
