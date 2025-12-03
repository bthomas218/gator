import { db } from "../index";
import { FeedFollow, feeds, NewFeedFollow, users } from "../schema";
import { feedFollows } from "../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollow(feedFollow: NewFeedFollow) {
  const [result] = await db.insert(feedFollows).values(feedFollow).returning();
  return result;
}

export async function getUserAndFeed(id: string) {
  const [result] = await db
    .select({
      feedName: feeds.name,
      userName: users.name,
      feedFollow: {
        id: feedFollows.id,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
      },
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, id));
  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      feedName: feeds.name,
      userName: users.name,
      feedFollow: {
        id: feedFollows.id,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
      },
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));
  return result;
}
