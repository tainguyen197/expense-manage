import { getCategories } from "@/actions/category";
import useCategoryStore from "@/store/slices/categoryStore";
import { useEffect } from "react";

const useFetchCategories = () => {
  const { categories, setCategories } = useCategoryStore();

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      setCategories(categories);
    };
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);
};

export default useFetchCategories;
