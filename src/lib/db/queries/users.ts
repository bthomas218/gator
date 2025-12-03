import { eq } from "drizzle-orm";
import { db } from "../index";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
}

// For testing enviroments
export async function deleteAllUsers() {
  await db.execute("TRUNCATE TABLE users cascade");
}

export async function getAllUsers() {
  const result = await db.select().from(users);
  return result;
}

export async function getUserById(id: string) {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  return result;
}
