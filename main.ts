import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "entry.txt");

let text: string;
try {
  text = readFileSync(sourcePath, "utf8");
} catch (err) {
  console.error(`cannot read entry.txt: ${(err as Error).message}`);
  process.exit(1);
}

const line = text.replace(/\r\n/g, "\n").replace(/\n$/, "");
if (line.length < 1 || line.length > 200) {
  console.error(`entry must be 1-200 characters, got ${line.length}`);
  process.exit(1);
}
if (line.trim().length === 0) {
  console.error("entry must not be only whitespace");
  process.exit(1);
}
if (line.includes("\n")) {
  console.error("entry must be a single line");
  process.exit(1);
}
if (/[\x00-\x1F\x7F]/.test(line)) {
  console.error("entry must not contain control characters");
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text.replace(/\r\n/g, "\n"), "utf8");
