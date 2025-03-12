"use server";

import { getCategoryList } from "@/db/category";

async function getCategories() {
  return getCategoryList();
}

async function getCategoryById(id: number) {
  return getCategoryById(id);
}

export { getCategories, getCategoryById };
