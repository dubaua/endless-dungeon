import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import ts from 'typescript';

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const ProjectRoot = resolve(ScriptDir, '..');
const TempDir = resolve(ProjectRoot, '.tmp-script-ts/remove-bad-pattern-lines');
const TrashDir = resolve(ProjectRoot, 'trash');

const resolvePath = (path) => {
  return resolve(ProjectRoot, path);
};

const rewriteRelativeImports = (content) => {
  return content.replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'");
};

const compileTsModule = async (sourcePath) => {
  const source = await readFile(sourcePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: true,
    },
  });

  const outputPath = resolve(TempDir, basename(sourcePath).replace(/\.ts$/, '.mjs'));

  await writeFile(outputPath, rewriteRelativeImports(transpiled.outputText));

  return outputPath;
};

const importPredicate = async (predicatePath) => {
  await rm(TempDir, { recursive: true, force: true });
  await mkdir(TempDir, { recursive: true });

  const outputPath = predicatePath.endsWith('.ts')
    ? await compileTsModule(predicatePath)
    : predicatePath;

  const module = await import(pathToFileURL(outputPath).href);
  const predicate =
    module.default ?? module.isBadPattern ?? module.shouldRemovePattern ?? module.findBadPattern;

  if (typeof predicate !== 'function') {
    throw new Error(
      'Predicate file must export default, isBadPattern, shouldRemovePattern, or findBadPattern',
    );
  }

  return predicate;
};

const findPatternInLine = (line) => {
  const quotedMatch = line.match(/^\s*['"]([ksohOx-]{16})['"],?\s*$/);

  if (quotedMatch) {
    return quotedMatch[1];
  }

  const rawMatch = line.match(/^\s*([ksohOx-]{16})\s*$/);

  return rawMatch?.[1];
};

const writeRemovedLinesToTrash = async (targetPath, removedLines) => {
  if (removedLines.length === 0) {
    return;
  }

  await mkdir(TrashDir, { recursive: true });

  const trashPath = resolve(TrashDir, basename(targetPath));
  const content = `${removedLines.join('\n')}\n`;

  await writeFile(trashPath, content);
};

const main = async () => {
  const [targetInputPath, predicateInputPath] = process.argv.slice(2);

  if (!targetInputPath || !predicateInputPath) {
    throw new Error(
      'Usage: node scripts/remove-bad-pattern-lines.mjs <target-ts-file> <predicate-ts-or-js-file>',
    );
  }

  const targetPath = resolvePath(targetInputPath);
  const predicatePath = resolvePath(predicateInputPath);
  const predicate = await importPredicate(predicatePath);
  const source = await readFile(targetPath, 'utf8');
  const lines = source.split(/\r?\n/);
  const keptLines = [];
  const removedLines = [];

  for (const line of lines) {
    const pattern = findPatternInLine(line);

    if (pattern && predicate(pattern)) {
      removedLines.push(line);
      continue;
    }

    keptLines.push(line);
  }

  await writeFile(targetPath, keptLines.join('\n'));
  await writeRemovedLinesToTrash(targetPath, removedLines);
  await rm(TempDir, { recursive: true, force: true });

  console.log(`Removed ${removedLines.length} pattern lines from ${targetPath}`);

  if (removedLines.length > 0) {
    console.log(`Moved removed lines to ${resolve(TrashDir, basename(targetPath))}`);
  }
};

void main();
