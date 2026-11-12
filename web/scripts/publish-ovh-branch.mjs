import { execFileSync, spawn } from "node:child_process";
import { cp, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "ovh-dist");
const work = "/tmp/pcs-ovh-publish";
const repo = "https://github.com/edgargranados/pcs-fisioterapia.git";

function git(args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, { cwd, stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`git ${args.join(" ")} failed`));
    });
  });
}

async function cloneOrInit() {
  await rm(work, { recursive: true, force: true });
  try {
    await git(["clone", "--branch", "ovh", "--single-branch", repo, work], root);
    return true;
  } catch {
    await rm(work, { recursive: true, force: true });
    await git(["init", "-b", "ovh", work], root);
    return false;
  }
}

const existed = await cloneOrInit();
const entries = await readdir(work);
for (const entry of entries) {
  if (entry === ".git") continue;
  await rm(path.join(work, entry), { recursive: true, force: true });
}
await cp(dist, work, {
  recursive: true,
  filter: (source) => path.basename(source) !== "config.local.php",
});

function gitConfig(key) {
  try {
    return execFileSync("git", ["-C", root, "config", key], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

const name = gitConfig("user.name") || "Edgar Granados";
const email = gitConfig("user.email") || "edgar@cocopool.es";
await git(["config", "user.name", name], work);
await git(["config", "user.email", email], work);
await git(["add", "-A"], work);
try {
  await git(["diff", "--cached", "--quiet"], work);
  console.log("ovh branch already matches this build");
} catch {
  await git(["commit", "-m", "Publica la web estática para OVH"], work);
}
if (!existed) {
  await git(["remote", "add", "origin", repo], work);
}
await git(["push", "-u", "origin", "ovh"], work);
