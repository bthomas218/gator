import { Console } from "console";
import {
  handlerLogin,
  registerCommand,
  runCommand,
  type CommandsRegistry,
} from "./commands";
import { exit } from "process";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  const [cmdName, ...args] = process.argv.slice(2);
  if (!cmdName) {
    console.error("Not enough args");
    exit(1);
  }
  runCommand(registry, cmdName, ...args);
}

main();
