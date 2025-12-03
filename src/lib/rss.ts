import { XMLParser } from "fast-xml-parser";
import { exit } from "process";

const parser = new XMLParser();

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  try {
    const response = await fetch(feedURL, {
      method: "GET",
      mode: "cors",
      headers: { "User-Agent": "gator", accept: "application/rss+xml" },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch feed: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.text();
    const validatedData = validateData(parser.parse(data));
    return validatedData;
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
    exit(1);
  }
}

function validateData(data: any) {
  const channel = data.rss?.channel;
  if (!channel) {
    throw new Error("Failed to parse channel");
  }

  if (
    !channel.title ||
    !channel.link ||
    !channel.description ||
    !channel.item
  ) {
    throw new Error("Failed to parse metadata");
  }

  const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];

  const rssItems: RSSItem[] = [];
  items.forEach((i: any, idx: number) => {
    if (!i.title || !i.link || !i.description || !i.pubDate) {
      return;
    }

    rssItems.push({
      title: i.title,
      link: i.link,
      description: i.description,
      pubDate: i.pubDate,
    });
  });

  const rssFeed: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };
  return rssFeed;
}
