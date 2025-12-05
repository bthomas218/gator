# gator

its short for aggreGATOR. It's a cli tool that aggreates rss feeds

## 🚀 Features

- aggreate many blogs!
- multiple users!
- view the latest posts!

## 🛠️ Tech Stack

- Node.js
- TypeScript
- PostgreSQL

## 📂 Project Structure

```text
.
├── drizzle.config.ts
├── package-lock.json
├── package.json
├── README.md
├── src
│  ├── commands
│  │  ├── aggregate.ts
│  │  ├── commands.ts
│  │  ├── following.ts
│  │  └── user.ts
│  ├── config.ts
│  ├── index.ts
│  ├── lib
│  │  ├── db
│  │  │  ├── index.ts
│  │  │  ├── migrations
│  │  │  │  ├── 0000_mature_warbound.sql
│  │  │  │  ├── 0001_whole_ironclad.sql
│  │  │  │  ├── 0002_melodic_black_bird.sql
│  │  │  │  ├── 0003_rare_sandman.sql
│  │  │  │  ├── 0004_loud_forgotten_one.sql
│  │  │  │  └── meta
│  │  │  │     ├── 0000_snapshot.json
│  │  │  │     ├── 0001_snapshot.json
│  │  │  │     ├── 0002_snapshot.json
│  │  │  │     ├── 0003_snapshot.json
│  │  │  │     ├── 0004_snapshot.json
│  │  │  │     └── _journal.json
│  │  │  ├── queries
│  │  │  │  ├── feedFollows.ts
│  │  │  │  ├── feeds.ts
│  │  │  │  ├── posts.ts
│  │  │  │  └── users.ts
│  │  │  └── schema.ts
│  │  └── rss.ts
│  └── middleware.ts
└── tsconfig.json
```

## ▶️ Usage

### Installation

```bash
git clone https://github.com/bthomas218/gator
cd gator
npm i
```

You will also need a `.gatorconfig.json` file in your home directory, along with a postgres database

```json
///.gatorconfig.json
{
  "db_url": "your connection string here",
  "current_user_name": "your name here"
}
```

### Commands

Running commands

```bash
npm run start $command # while in the gator directory
```

- `login <user_name>`
  - login as the specified user if they exist
- `register <user_name>`
  - register the user in the database
- `reset`
  - truncates the user table in the database
- `users`
  - lists all users
- `agg <time_between_reqs>`
  - arg: `time_between_reqs` = `(number)(ms|s|m|h)`
    - It's the time between making requests to feed urls
    - **Please don't dos servers!!!**
  - aggregates rss feeds for all users in the background
- `feeds`
  - lists all feeds and users, along with displaying who is the current logged in user

The following need a logged in user

- `addfeed <name> <url>`
  - args
    - name: rss feed name
    - url: rss feed url
  - Adds a feed to the database and makes the current logged in user follow it
- `follow <url>`
  - Makes the current logged in user start following this feed if it exists in the database
- `unfollow <url>`
  - Makes the current logged in user unfollow this feed if it exists in the database
- `browse [limit]`
  - arg: limit (optional)
    - the number of posts to display
    - defaults to 2
  - display the `limit` latest posts that the current logged in user is following
