import { eq } from "drizzle-orm";
import { db } from "../index";
import { feeds, type NewFeed } from "../schema";

export async function createFeed(feed: NewFeed) {
  const [result] = await db.insert(feeds).values(feed).returning();
  return result;
}

export async function getAllFeeds() {
  const result = await db.select().from(feeds);
  return result;
}

export async function getFeedbyURL(URL: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, URL));
  return result;
}
