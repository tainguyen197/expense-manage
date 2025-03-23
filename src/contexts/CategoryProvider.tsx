"use client";

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
      console.log("start fetching categories", categories);
      try {
        const categories = await getCategories();
        console.log("categories", categories);
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    console.log("Effect running - Component mounted");
    fetchCategories();

    return () => {
      console.log("Effect cleanup - Component unmounting");
    };
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoryProvider;
