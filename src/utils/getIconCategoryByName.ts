import { Category } from "@/types/category";
import { loadDataFromLocalStorage } from "./localStorage";
import { defaultCategoryId } from "@/app/api/prompt";

export const getIconCategoryByName = (id: number) => {
  const categories = loadDataFromLocalStorage<Category[]>("category") || [];
  const category = categories.find((c) => c.id == (id || defaultCategoryId))!;
  return category;
};
