import { db } from "../index";
import { feeds, type NewFeed } from "../schema";

export async function createFeed(feed: NewFeed) {
  const [result] = await db.insert(feeds).values(feed).returning();
  return result;
}
