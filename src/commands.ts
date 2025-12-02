import { exit } from "process";
import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = Record<string, CommandHandler>;

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length != 1) {
    console.error("Usage: login <username>");
    exit(1);
  }
  const username = args[0];
  setUser(username);
  console.log("User has been set");
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  if (cmdName in registry) {
    registry[cmdName](cmdName, ...args);
  } else {
    console.error("Command not registered");
    exit(1);
  }
}
