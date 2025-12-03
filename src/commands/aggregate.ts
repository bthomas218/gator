/**
 * Commands relating to aggregation
 */

import { readConfig } from "src/config";
import { fetchFeed } from "../lib/rss";
import { getUserById, getUserByName } from "src/lib/db/queries/users";
import {
  createFeed,
  getAllFeeds,
  getFeedbyURL,
} from "src/lib/db/queries/feeds";
import { Feed, User } from "src/lib/db/schema";
import {
  createFeedFollow,
  getFeedFollowsForUser,
  getUserAndFeed,
} from "src/lib/db/queries/feedFollows";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.dir(feed, { depth: null });
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error("Usage: addfeed <name> <url>");
  }

  const { currentUserName } = readConfig();
  if (!currentUserName) {
    throw new Error("No user logged in");
  }

  const [name, url] = args;
  const user = await getUserByName(currentUserName);
  const feed = await createFeed({ name: name, url: url, userId: user.id });
  await createFeedFollow({ userId: user.id, feedId: feed.id });
  printFeed(feed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getAllFeeds();
  for (const feed of feeds) {
    if (!feed.userId) {
      continue;
    }
    const user = await getUserById(feed.userId);
    console.log(
      `Feed: ${feed.name}\n\t-URL: ${feed.url}\n\t-User: ${user.name}`
    );
  }
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Usage: follow <url>");
  }
  const feedURL = args[0];

  const { currentUserName } = readConfig();
  if (!currentUserName) {
    throw new Error("No user logged in");
  }
  const currentUser = await getUserByName(currentUserName);

  const feedToAdd = await getFeedbyURL(feedURL);
  if (!feedToAdd) {
    throw new Error("Feed not added");
  }

  const feedFollow = await createFeedFollow({
    userId: currentUser.id,
    feedId: feedToAdd.id,
  });
  const { userName, feedName } = await getUserAndFeed(feedFollow.id);
  console.log("Created feed-follow:", feedFollow);
  console.log(`Feed name: ${feedName}`);
  console.log(`User name: ${userName}`);
}

function printFeed(feed: Feed, user: User) {
  console.log("User:", user);
  console.log("Feed:", feed);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  const { currentUserName } = readConfig();
  if (!currentUserName) {
    throw new Error("No user logged in");
  }
  const currentUser = await getUserByName(currentUserName);
  const following = await getFeedFollowsForUser(currentUser.id);
  following.forEach((f) => {
    console.log(`* ${f.feedName}`);
  });
}
