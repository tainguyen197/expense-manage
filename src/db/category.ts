import { db } from "@/db";

const getCategoryList = async () => {
  return getCategoryListInternal();
};

const getCategoryListInternal = async () => {
  return db.query.categories.findMany();
};

export { getCategoryList };
