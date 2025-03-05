import { getCategoryList } from "@/db/category";

async function getCategories() {
  return getCategoryList();
}

export { getCategories };
