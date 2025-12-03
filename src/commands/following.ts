/**
 * Commands related to following blogs
 */
import { getUserById } from "src/lib/db/queries/users";
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

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) {
    throw new Error("Usage: addfeed <name> <url>");
  }

  const [name, url] = args;
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
      `Feed: ${feed.name}\n\t* URL: ${feed.url}\n\t* User: ${user.name}`
    );
  }
}

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error("Usage: follow <url>");
  }
  const feedURL = args[0];

  const feed = await getFeedbyURL(feedURL);
  if (!feed) {
    throw new Error("Feed not added");
  }

  const feedFollow = await createFeedFollow({
    userId: user.id,
    feedId: feed.id,
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

export async function handlerFollowing(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const following = await getFeedFollowsForUser(user.id);
  following.forEach((f) => {
    console.log(`* ${f.feedName}`);
  });
}
