import fs from "fs";
import path from "path";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fileURLToPath } from "url";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const MANIFEST_PATH = path.join(CONTENT_DIR, ".image-manifest.json");

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

function getS3Client() {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.warn("R2 credentials not set. Skipping image upload.");
    return null;
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  });
}

function computeHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 12);
}

function getAllImages() {
  const images = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(fullPath); }
      else if (/\.(webp|png|jpg|jpeg|gif|svg)$/i.test(entry.name)) {
        const relativePath = path.relative(CONTENT_DIR, fullPath).replace(/\\/g, "/");
        images.push({ fullPath, relativePath });
      }
    }
  }
  walk(path.join(CONTENT_DIR, "blog", "images"));
  walk(path.join(CONTENT_DIR, "wiki"));
  return images;
}

function loadManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8")); } catch { return {}; }
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml" };
  return mimeTypes[ext] || "application/octet-stream";
}

async function main() {
  const client = getS3Client();
  const manifest = loadManifest();
  const images = getAllImages();

  if (images.length === 0) {
    console.log("No images found to upload.");
    return;
  }

  let uploaded = 0, skipped = 0, removed = 0;
  const validKeys = new Set();

  for (const { fullPath, relativePath } of images) {
    const fileBuffer = fs.readFileSync(fullPath);
    const contentHash = computeHash(fileBuffer);
    const existing = manifest[relativePath];
    validKeys.add(relativePath);

    if (existing && existing.contentHash === contentHash) { skipped++; continue; }

    if (!client) {
      const basePath = relativePath.startsWith("blog/") ? "/blog" : "/wiki";
      manifest[relativePath] = { r2Url: `${basePath}/content-images/${relativePath}`, contentHash };
      skipped++;
      continue;
    }

    const fileName = path.basename(fullPath);
    const r2Key = `raita/${relativePath.replace(/\/[^/]+$/, "")}/${contentHash}-${fileName}`;

    try {
      await client.send(new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: fileBuffer,
        ContentType: getMimeType(fullPath),
        CacheControl: "public, max-age=31536000, immutable",
      }));
      manifest[relativePath] = { r2Url: `${R2_PUBLIC_URL}/${r2Key}`, contentHash };
      uploaded++;
      console.log(`Uploaded: ${relativePath}`);
    } catch (err) {
      console.error(`Failed to upload ${relativePath}:`, err.message);
    }
  }

  for (const key of Object.keys(manifest)) {
    if (!validKeys.has(key)) { delete manifest[key]; removed++; }
  }

  saveManifest(manifest);
  console.log(`Done: ${uploaded} uploaded, ${skipped} skipped, ${removed} removed`);
}

main().catch(console.error);
