import { CommandHandler, UserCommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";

export function middlewareLoggedIn(
  handler: UserCommandHandler
): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const { currentUserName } = readConfig();
    if (!currentUserName) {
      throw new Error("No user logged in");
    }

    const user = await getUserByName(currentUserName);
    if (!user) {
      throw new Error("User isn't registered");
    }

    await handler(cmdName, user, ...args);
  };
}
