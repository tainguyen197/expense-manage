import { db } from "@/db";
import { eq } from "drizzle-orm";
import { categories } from "./schema";

const getCategoryList = async () => {
  return getCategoryListInternal();
};

const getCategoryListInternal = async () => {
  return db.query.categories.findMany();
};

const getCategoryByIdInternal = async (id: number) => {
  return db.query.categories.findFirst({ where: eq(categories.id, id) });
};

export { getCategoryList, getCategoryByIdInternal };
