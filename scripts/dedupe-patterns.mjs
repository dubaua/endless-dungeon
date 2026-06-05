import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const ProjectRoot = resolve(ScriptDir, '..');

const resolvePath = (path) => {
  return resolve(ProjectRoot, path);
};

const readLines = async (path) => {
  const content = await readFile(path, 'utf8');

  return content.split(/\r?\n/);
};

const main = async () => {
  const [inputPath] = process.argv.slice(2);

  if (!inputPath) {
    throw new Error('Usage: node scripts/dedupe-patterns.mjs <input>');
  }

  const sourcePath = resolvePath(inputPath);
  const lines = await readLines(sourcePath);
  const seenPatterns = new Set();
  const resultLines = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) {
      resultLines.push(line);
      return;
    }

    if (seenPatterns.has(trimmedLine)) {
      return;
    }

    seenPatterns.add(trimmedLine);
    resultLines.push(line);
  });

  await writeFile(sourcePath, resultLines.join('\n'));
  console.log(`Wrote ${seenPatterns.size} unique patterns to ${sourcePath}`);
};

void main();
