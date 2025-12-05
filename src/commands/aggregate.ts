/**
 * Commands relating to aggregation
 */
import { db } from "src/lib/db";
import { fetchFeed } from "../lib/rss";
import { getNextFeedtoFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { exit } from "process";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("Usage: agg <time_between_reqs>");
  }

  const timeBetweenReqs = parseDuration(args[0]);
  if (!timeBetweenReqs) {
    throw new Error("Invalid duration string");
  }

  console.log(`Collecting feeds every ${timeBetweenReqs}`);

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

async function scrapeFeeds() {
  const feed = await getNextFeedtoFetch();

  if (!feed) {
    throw new Error("No feed to fetch!");
  }

  markFeedFetched(feed.id);
  const feedChannel = await fetchFeed(feed.url);

  console.log(
    `${feed.name} collected, ${feedChannel.channel.item.length} posts found`
  );
  feedChannel.channel.item.forEach((i) => {
    console.log(`\t* ${i.title}`);
  });
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
