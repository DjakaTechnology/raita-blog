import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP_DIR = path.join(ROOT, "src/app");
const APP_WIKI_DIR = path.join(ROOT, "src/app-wiki");
const APP_BLOG_BACKUP = path.join(ROOT, "src/app-blog-backup");

const target = process.argv[2];

if (target === "wiki") {
  if (fs.existsSync(APP_BLOG_BACKUP)) {
    console.log("Already swapped to wiki mode.");
    process.exit(0);
  }
  fs.renameSync(APP_DIR, APP_BLOG_BACKUP);
  fs.renameSync(APP_WIKI_DIR, APP_DIR);
  console.log("Swapped to wiki mode: app-wiki -> app");
} else if (target === "blog") {
  if (!fs.existsSync(APP_BLOG_BACKUP)) {
    console.log("Already in blog mode.");
    process.exit(0);
  }
  fs.renameSync(APP_DIR, APP_WIKI_DIR);
  fs.renameSync(APP_BLOG_BACKUP, APP_DIR);
  console.log("Restored to blog mode: app-blog-backup -> app");
} else {
  console.error("Usage: node scripts/swap-app.mjs <wiki|blog>");
  process.exit(1);
}
