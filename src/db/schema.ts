import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Clerk user table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk provides a string-based user ID
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Categories (e.g., "Ăn uống", "Nhà ở")
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
});

// Expense history
export const expenseHistory = pgTable("expense_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  item: text("item").notNull(),
  amount: integer("amount").notNull(),
  category: integer("category")
    .references(() => categories.id)
    .notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Transaction history
export const incomeHistory = pgTable("income_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  item: text("item").notNull(),
  amount: integer("amount").notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  category: integer("category")
    .references(() => categories.id)
    .notNull(),
});

export const roleTypeEnum = pgEnum("role_type", [
  "system",
  "user",
  "assistant",
  "tool",
]);
export const chatKindEnum = pgEnum("kind_type", [
  "add_expense",
  "delete_expense",
  "add_income",
  "delete_income",
  "default",
  "calculate_income",
  "calculate_expense",
]);

// Chat history (if storing user messages)
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  role: roleTypeEnum("role_type").notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  kind: chatKindEnum("kind_type"),
});

// Define relations
export const expenseRelations = relations(expenseHistory, ({ one }) => ({
  user: one(users, {
    fields: [expenseHistory.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [expenseHistory.category],
    references: [categories.id],
  }),
}));

export const incomeRelations = relations(incomeHistory, ({ one }) => ({
  user: one(users, {
    fields: [incomeHistory.userId],
    references: [users.id],
  }),
  categories: one(categories, {
    fields: [incomeHistory.category],
    references: [categories.id],
  }),
}));

export const chatRelations = relations(chatHistory, ({ one }) => ({
  user: one(users, {
    fields: [chatHistory.userId],
    references: [users.id],
  }),
}));
