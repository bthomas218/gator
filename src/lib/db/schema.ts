import { unique } from "drizzle-orm/pg-core";
import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
});

export const feedFollows = pgTable(
  "feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    feedId: uuid("feed_id")
      .references(() => feeds.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [unique().on(t.userId, t.feedId)]
);

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewFeed = typeof feeds.$inferInsert;
export type Feed = typeof feeds.$inferSelect;
export type NewFeedFollow = typeof feedFollows.$inferInsert;
export type FeedFollow = typeof feedFollows.$inferSelect;
