import { getCategories } from "@/actions/category";
import { Category } from "@/types/category";
import React, { createContext, useState, useContext, useEffect } from "react";

const CategoriesContext = createContext<{
  categories: Category[];
}>({
  categories: [],
});

export const useCategories = () => useContext(CategoriesContext);

export const CategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoryProvider;
