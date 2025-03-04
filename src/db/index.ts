import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
export const db = drizzle(sql, { schema });

async function ensureUserExists(userId: string, email: string) {
  const user = await db.query.users.findFirst({
    where: ({ id }, { eq }) => eq(id, userId),
  });

  if (!user) {
    await db.insert(schema.users).values({
      id: userId,
      email: email,
      createdAt: new Date(),
    });

    console.log("Added mock user");
  } else {
    console.log("User already exists", user);
  }
}

//add list category to db
async function ensureCategoryExists() {
  const defaultCategory = [
    { id: 1, name: "Nhà ở", icon: "🏠" },
    { id: 2, name: "Giao thông", icon: "🚗" },
    { id: 3, name: "Ăn uống", icon: "🍔" },
    { id: 4, name: "Cá nhân/Sức khỏe", icon: "💊" },
    { id: 5, name: "Giải trí", icon: "🎮" },
    { id: 6, name: "Tiết kiệm/Đầu tư", icon: "💰" },
    { id: 7, name: "Nợ", icon: "💳" },
    { id: 8, name: "Khác", icon: "🧾" },
    { id: 9, name: "Bảo hiểm", icon: "🛡️" },
    { id: 10, name: "Du lịch", icon: "✈️" },
    { id: 11, name: "Công việc/Kinh doanh", icon: "💼" },
    { id: 12, name: "Lương thưởng", icon: "💵" },
  ];

  for (const category of defaultCategory) {
    const existing = await db.query.categories.findFirst({
      where: ({ name }, { eq }) => eq(name, category.name),
    });

    if (!existing) {
      await db.insert(schema.categories).values({
        name: category.name,
        icon: category.icon,
      });

      console.log("Added category", category);
    } else {
      console.log("Category already exists", existing);
    }
  }
}

export default async function handler() {
  try {
    const userId = "mock_user";
    const email = "mock_user@example.com";

    // Ensure the user exists
    await ensureUserExists(userId, email);
    // await ensureCategoryExists();

    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

await handler();
