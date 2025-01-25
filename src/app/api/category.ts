import { Category } from "@/types/category";
import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "@/utils/localStorage";

export const getCategoryList = () => {
  return loadDataFromLocalStorage<Category[]>("category") || [];
};

export const addCategory = (category: Category) => {
  const categoryList = loadDataFromLocalStorage<Category[]>("category") || [];
  categoryList.push(category);
  saveDataToLocalStorage("category", categoryList);
};
