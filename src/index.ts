import { handlerAgg } from "./commands/aggregate";
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

async function main() {
  try {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);

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
