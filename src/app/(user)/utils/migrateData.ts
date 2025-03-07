// Migrate from local storage to online storage

import { createExpense } from "@/actions/expense";
import { addMessage } from "@/actions/message";
import { Expense } from "@/types/expense";
import { Message } from "@/types/message";

const migrateChatHistory = () => {
  const chatHistory = localStorage.getItem("chat-history");
  const chatMigrated = localStorage.getItem("chat-migrated");
  const chatArray = JSON.parse(chatHistory!);

  if (chatMigrated === "true") {
    return;
  }

  if (chatArray.length) {
    // create promise all to save to db
    const promises = chatArray.map((chat: Message & { timestamp: number }) => {
      return addMessage({ ...chat, timestamp: new Date(chat.timestamp) });
    });

    return Promise.all(promises).then(() => {
      console.log("migrate chat history success");
      localStorage.setItem("chat-migrated", "true");
    });
  }
};

const migrateExpenseHistory = () => {
  const expenseHistory = localStorage.getItem("expense-history");
  const expenseMigrated = localStorage.getItem("expense-migrated");
  const expenseArray = JSON.parse(expenseHistory!);

  if (expenseMigrated === "true") {
    return;
  }

  if (expenseArray.length) {
    // create promise all to save to db
    const promises = expenseArray.map(
      (expense: Expense & { timestamp: number }) => {
        return createExpense({
          ...expense,
          timestamp: new Date(expense.timestamp),
        });
      }
    );

    return Promise.all(promises).then(() => {
      console.log("migrate expense history success");
      localStorage.setItem("expense-migrated", "true");
    });
  }
};

const migrateIncomeHistory = () => {
  const incomeHistory = localStorage.getItem("income-history");
  const incomeMigrated = localStorage.getItem("income-migrated");
  const incomeArray = JSON.parse(incomeHistory!);

  if (incomeMigrated === "true") {
    return;
  }

  if (incomeArray.length) {
    // create promise all to save to db
    const promises = incomeArray.map(
      (income: Expense & { timestamp: number }) => {
        return createExpense({
          ...income,
          timestamp: new Date(income.timestamp),
        });
      }
    );

    return Promise.all(promises).then(() => {
      console.log("migrate income history success");
      localStorage.setItem("income-migrated", "true");
    });
  }
};

export { migrateChatHistory, migrateExpenseHistory, migrateIncomeHistory };
