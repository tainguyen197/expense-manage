import { Category } from "@/types/category";
import { loadDataFromLocalStorage } from "./localStorage";

export const getIconCategoryByName = (name: number) => {
  const categories = loadDataFromLocalStorage<Category[]>("category") || [];
  const category = categories.find((c) => c.id == name);
  return category;
};
