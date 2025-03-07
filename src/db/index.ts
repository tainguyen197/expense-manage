import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
export const db = drizzle(sql, { schema });

// async function ensureUserExists(userId: string, email: string) {
//   const user = await db.query.users.findFirst({
//     where: ({ id }, { eq }) => eq(id, userId),
//   });

//   if (!user) {
//     await db.insert(schema.users).values({
//       id: userId,
//       email: email,
//       createdAt: new Date(),
//     });

//     console.log("Added mock user");
//   } else {
//     console.log("User already exists", user);
//   }
// }

// export default async function handler() {
//   try {
//     const userId = "mock_user";
//     const email = "mock_user@example.com";

//     // Ensure the user exists
//     await ensureUserExists(userId, email);
//     // await ensureCategoryExists();

//     console.log("Connected to database");
//   } catch (error) {
//     console.error("Error connecting to database:", error);
//   }
// }

// await handler();
