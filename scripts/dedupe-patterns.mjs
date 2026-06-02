import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const ProjectRoot = resolve(ScriptDir, '..');

const resolvePath = (path) => {
  return resolve(ProjectRoot, path);
};

const readPatterns = async (path) => {
  const content = await readFile(path, 'utf8');

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const main = async () => {
  const [inputPath] = process.argv.slice(2);

  if (!inputPath) {
    throw new Error('Usage: node scripts/dedupe-patterns.mjs <input>');
  }

  const sourcePath = resolvePath(inputPath);
  const patterns = await readPatterns(sourcePath);
  const uniquePatterns = [...new Set(patterns)];

  await writeFile(sourcePath, `${uniquePatterns.join('\n')}\n`);
  console.log(`Wrote ${uniquePatterns.length} unique patterns to ${sourcePath}`);
};

void main();
