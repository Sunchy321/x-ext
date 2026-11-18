import { spawnSync } from "node:child_process";
import { access, chmod, copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const extensionRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(extensionRoot, "..");
const executable = process.platform === "win32"
  ? "x-language-server.exe"
  : "x-language-server";
const sourceExecutable = path.join(
  workspaceRoot,
  "xc",
  "target",
  "release",
  executable,
);
const stagingDirectory = path.join(extensionRoot, "server");
let createdStagingDirectory = false;

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: extensionRoot,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status ?? "unknown"}`);
  }
}

try {
  run("pnpm", [
    "exec",
    "esbuild",
    "extension.js",
    "--bundle",
    "--platform=node",
    "--format=cjs",
    "--external:vscode",
    "--outfile=out/extension.js",
  ]);
  run("cargo", [
    "build",
    "--release",
    "--manifest-path",
    path.join(workspaceRoot, "xc", "Cargo.toml"),
    "-p",
    "x-language-server",
  ]);
  await access(sourceExecutable);

  try {
    await access(stagingDirectory);
    throw new Error(`Refusing to overwrite existing staging directory: ${stagingDirectory}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  await mkdir(stagingDirectory);
  createdStagingDirectory = true;
  const stagedExecutable = path.join(stagingDirectory, executable);
  await copyFile(sourceExecutable, stagedExecutable);
  if (process.platform !== "win32") {
    await chmod(stagedExecutable, 0o755);
  }
  run("pnpm", [
    "exec",
    "vsce",
    "package",
    "--no-dependencies",
    "--skip-license",
    "--allow-missing-repository",
  ]);
} finally {
  if (createdStagingDirectory) {
    await rm(stagingDirectory, { recursive: true, force: true });
  }
}
