import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const children = [];
let stopping = false;

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) {
    if (!child.pid) continue;
    try {
      if (process.platform === "win32") child.kill("SIGTERM");
      else process.kill(-child.pid, "SIGTERM");
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }
  }
}

process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());

console.log("Website: http://localhost:3000");
console.log("Slice Machine: http://localhost:9999");

for (const [entry, args] of [
  ["next/dist/bin/next", ["dev", "--port", "3000"]],
  ["slice-machine-ui/bin/start-slicemachine.cjs", []],
]) {
  const child = spawn(process.execPath, [require.resolve(entry), ...args], {
    stdio: "inherit",
    detached: process.platform !== "win32",
  });
  children.push(child);
  child.on("error", (error) => {
    console.error(error);
    stop(1);
  });
  child.on("exit", (code, signal) => {
    if (!stopping) stop(code ?? (signal ? 1 : 0));
  });
}
