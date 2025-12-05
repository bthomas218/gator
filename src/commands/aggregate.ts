/**
 * Commands relating to aggregation
 */
import { createPost, getPostsForUser } from "src/lib/db/queries/posts";
import { fetchFeed } from "../lib/rss";
import { getNextFeedtoFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { NewPost, User } from "src/lib/db/schema";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Usage: agg <time_between_reqs>");
  }

  const timeBetweenReqs = parseDuration(args[0]);
  if (!timeBetweenReqs) {
    throw new Error("Invalid duration string");
  }

  console.log(`Collecting feeds every ${timeBetweenReqs}ms`);

  scrapeFeeds().catch(errorHandler);

  const interval = setInterval(() => {
    scrapeFeeds().catch(errorHandler);
  }, timeBetweenReqs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  let limit;
  if (args.length > 0) {
    limit = parseInt(args[0], 10);
    if (isNaN(limit)) {
      throw new Error("Usage: browse [limit]");
    }
  }

  const posts = await getPostsForUser(user.id, limit ?? 2);

  console.log(`Got ${posts.length} posts for ${user.name}`);
  posts.forEach((p) => {
    console.log(`Title: ${p.title}`);
    console.log(`\t* Feed: ${p.feedName}`);
    console.log(`\t* Published: ${p.publishedAt}`);
    console.log(`\t* url: ${p.url}`);
    console.log(`${p.description}`);
  });
}

async function scrapeFeeds() {
  const feed = await getNextFeedtoFetch();

  if (!feed) {
    throw new Error("No feed to fetch!");
  }

  markFeedFetched(feed.id);
  const feedChannel = (await fetchFeed(feed.url)).channel;

  for (const item of feedChannel.item) {
    await createPost({
      url: item.link,
      title: item.title,
      description: item.description,
      publishedAt: new Date(item.pubDate),
      feedId: feed.id,
    } satisfies NewPost);
  }
}

function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/; // [0] = whole string, [1] = number value, [2] = units
  const match = durationStr.match(regex);
  if (!match) return;

  const value = parseInt(match[1], 10);
  const units = match[2];

  switch (units) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60_000;
    case "h":
      return value * 3.6e6;
  }
}

function errorHandler(err: unknown) {
  console.log(
    `Error scraping feeds: ${err instanceof Error ? err.message : err}`
  );
}
