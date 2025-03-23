import { create } from "zustand";
import { Category } from "@/types/category";
import { devtools } from "zustand/middleware";
interface CategoryStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

// add devtools
const useCategoryStore = create<CategoryStore>()(
  devtools<CategoryStore>(
    (set) => ({
      categories: [],
      setCategories: (categories) => set({ categories }),
    }),
    {
      name: "category-store",
    }
  )
);

export default useCategoryStore;
