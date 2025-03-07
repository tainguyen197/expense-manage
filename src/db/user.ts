import { db } from "@/db";

import { users } from "./schema";
import { User } from "@/types/user";
import { eq } from "drizzle-orm";

const createUser = async (user: User) => {
  return createUserInternal(user);
};

const createUserInternal = async (user: User) => {
  return db.insert(users).values(user).returning({ id: users.id });
};

const deleteUser = async (user_id: string) => {
  return deleteUserInternal(user_id);
};

const deleteUserInternal = async (user_id: string) => {
  return db
    .delete(users)
    .where(eq(users.id, user_id))
    .returning({ id: users.id });
};
export { createUser, deleteUser };
