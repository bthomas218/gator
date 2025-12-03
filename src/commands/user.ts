import { setUser } from "../config";
import { getUserByName, createUser } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length != 1) {
    throw new Error("Usage: login <username>");
  }
  const username = args[0];
  const user = await getUserByName(username);
  if (!user) {
    throw new Error("User doesn't exist");
  }
  setUser(username);
  console.log("User has been set");
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length != 1) {
    throw new Error("Usage: register <name>");
  }
  const username = args[0];
  if (await getUserByName(username)) {
    throw new Error("User already exists");
  }
  const user = await createUser(username);
  setUser(user.name);
  console.log("User created:", user);
}
