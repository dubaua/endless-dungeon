import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import ts from 'typescript';

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const ProjectRoot = resolve(ScriptDir, '..');
const TempDir = resolve(ProjectRoot, '.tmp-script-ts/drums');

const TsModules = [
  'src/generators/drums/count-pattern-beats.ts',
  'src/generators/drums/new-syncope-grade.ts',
  'src/generators/drums/weigh-kick-offbeat-pattern.ts',
];

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

const rewriteRelativeImports = (content) => {
  return content.replace(/from '(\.\/[^']+)'/g, "from '$1.mjs'");
};

const compileTsModule = async (sourcePath) => {
  const source = await readFile(resolvePath(sourcePath), 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: true,
    },
  });
  const outputPath = resolve(TempDir, sourcePath.split('/').at(-1).replace(/\.ts$/, '.mjs'));

  await writeFile(outputPath, rewriteRelativeImports(transpiled.outputText));

  return outputPath;
};

const importWeighKickOffbeatPattern = async () => {
  await rm(TempDir, { recursive: true, force: true });
  await mkdir(TempDir, { recursive: true });

  for (const sourcePath of TsModules) {
    await compileTsModule(sourcePath);
  }

  const module = await import(pathToFileURL(resolve(TempDir, 'weigh-kick-offbeat-pattern.mjs')).href);

  return module.weighKickOffbeatPattern;
};

const main = async () => {
  const [inputPath, thresholdInput = '12'] = process.argv.slice(2);

  if (!inputPath) {
    throw new Error('Usage: node scripts/filter-kick-syncopation.mjs <input> [threshold]');
  }

  const threshold = Number(thresholdInput);

  if (!Number.isFinite(threshold)) {
    throw new Error('Threshold must be a number');
  }

  const sourcePath = resolvePath(inputPath);
  const weighKickOffbeatPattern = await importWeighKickOffbeatPattern();
  const patterns = await readPatterns(sourcePath);
  const filteredPatterns = patterns.filter((pattern) => {
    const weight = weighKickOffbeatPattern(pattern);

    return weight.syncopationScore <= threshold;
  });

  await writeFile(sourcePath, `${filteredPatterns.join('\n')}\n`);
  await rm(TempDir, { recursive: true, force: true });
  console.log(
    `Wrote ${filteredPatterns.length} patterns to ${sourcePath}, removed ${
      patterns.length - filteredPatterns.length
    }`,
  );
};

void main();
