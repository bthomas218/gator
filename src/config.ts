import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName?: string;
};

export function setUser(userName: string) {
  writeConfig({ dbUrl: "postgres://example", currentUserName: userName });
}

export function readConfig() {
  try {
    const configPath = getConfigFilePath();
    let rawConfig;
    rawConfig = fs.readFileSync(configPath, { encoding: "utf-8" });
    return validateConfig(JSON.parse(rawConfig));
  } catch (error) {
    console.error(`Failed to read config: ${error}`);
  }
}

function getConfigFilePath(): string {
  const configPath = path.join(os.homedir(), ".gatorconfig.json");
  return configPath;
}

function writeConfig(cfg: Config) {
  try {
    const configPath = getConfigFilePath();
    const { dbUrl: db_url, currentUserName: current_user_name } = cfg;
    fs.writeFileSync(
      configPath,
      JSON.stringify({ db_url: db_url, current_user_name: current_user_name })
    );
  } catch (err) {
    throw new Error(`Failed to write config: ${err}`);
  }
}

function validateConfig(rawConfig: any) {
  if (rawConfig && typeof rawConfig === "object") {
    if ("db_url" in rawConfig && typeof rawConfig.db_url === "string") {
      const { db_url: dbUrl } = rawConfig;
      if (
        "current_user_name" in rawConfig &&
        typeof rawConfig.current_user_name === "string"
      ) {
        const { current_user_name: currentUserName } = rawConfig;
        return {
          dbUrl: dbUrl,
          currentUserName: currentUserName,
        } as Config;
      }
      return {
        dbUrl: dbUrl,
      } as Config;
    }
  }
  console.error("Invalid Config");
}
