import { Category } from "@/types/category";
import { loadDataFromLocalStorage } from "./localStorage";

export const getIconCategoryByName = (id: number) => {
  const categories = loadDataFromLocalStorage<Category[]>("category") || [];
  const category = categories.find((c) => c.id == id)!;
  return category;
};
