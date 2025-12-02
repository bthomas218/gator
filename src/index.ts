import { setUser, readConfig } from "./config";

function main() {
  setUser("Brady");
  console.log(readConfig());
}

main();
