import { handlerAgg } from "./commands/aggregate";
import {
  handlerAddFeed,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
} from "./commands/following";
import {
  registerCommand,
  runCommand,
  type CommandsRegistry,
} from "./commands/commands";
import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
} from "./commands/user";
import { exit } from "process";
import { middlewareLoggedIn } from "./middleware";

async function main() {
  try {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(registry, "feeds", handlerFeeds);
    registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(
      registry,
      "following",
      middlewareLoggedIn(handlerFollowing)
    );

    const [cmdName, ...args] = process.argv.slice(2);
    if (!cmdName) {
      console.error("Not enough args");
      exit(1);
    }
    await runCommand(registry, cmdName, ...args);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      exit(1);
    }
  }
}

await main();
process.exit(0);
