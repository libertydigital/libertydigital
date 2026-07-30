import { existsSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

function parseEnvLocal(file) {
  const env = {};

  if (!existsSync(file)) {
    return env;
  }

  const content = readFileSync(file, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error("Usage: node scripts/run-with-env-local.mjs <command> [...args]");
  process.exit(1);
}

function resolveCommand(commandName) {
  if (process.platform !== "win32") {
    const localBin = join("node_modules", ".bin", commandName);
    return {
      command: existsSync(localBin) ? localBin : commandName,
      args,
    };
  }

  const localCmd = join("node_modules", ".bin", `${commandName}.cmd`);
  if (existsSync(localCmd)) {
    return {
      command: "cmd.exe",
      args: ["/d", "/s", "/c", localCmd, ...args],
    };
  }

  return {
    command: commandName,
    args,
  };
}

const resolved = resolveCommand(command);
const child = spawn(resolved.command, resolved.args, {
  env: {
    ...process.env,
    ...parseEnvLocal(".env.local"),
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
