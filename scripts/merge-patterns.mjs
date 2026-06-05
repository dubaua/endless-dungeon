import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const ProjectRoot = resolve(ScriptDir, '..');

const resolvePath = (path) => {
  return resolve(ProjectRoot, path);
};

const getUsage = () => {
  return 'Usage: node scripts/merge-txt-files.mjs <folder> <result>';
};

const main = async () => {
  const [inputFolderPath, outputPath] = process.argv.slice(2);

  if (!inputFolderPath || !outputPath) {
    throw new Error(getUsage());
  }

  const folderPath = resolvePath(inputFolderPath);
  const resultPath = resolvePath(outputPath);

  const entries = await readdir(folderPath, { withFileTypes: true });
  const txtFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith('.txt'))
    .sort();

  const contents = await Promise.all(
    txtFiles.map(async (fileName) => {
      const filePath = resolve(folderPath, fileName);
      const content = await readFile(filePath, 'utf8');

      return content.trimEnd();
    }),
  );

  await writeFile(resultPath, `${contents.filter(Boolean).join('\n')}\n`);

  console.log(`Merged ${txtFiles.length} txt files into ${resultPath}`);
};

void main();
