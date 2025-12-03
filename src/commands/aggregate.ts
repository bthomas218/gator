/**
 * Commands relating to aggregation
 */

import { readConfig } from "src/config";
import { fetchFeed } from "../lib/rss";
import { getUserByName } from "src/lib/db/queries/users";
import { createFeed } from "src/lib/db/queries/feeds";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.dir(feed, { depth: null });
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error("Usage: addFeed <name> <url>");
  }

  const { currentUserName } = readConfig();
  if (!currentUserName) {
    throw new Error("No user logged in");
  }

  const [name, url] = args;
  const user = await getUserByName(currentUserName);
  const feed = await createFeed({ name: name, url: url, userId: user.id });
  printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
  console.log("User:", user);
  console.log("Feed:", feed);
}
