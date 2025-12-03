/**
 * Commands relating to aggregation
 */
import { fetchFeed } from "../lib/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.dir(feed, { depth: null });
}
