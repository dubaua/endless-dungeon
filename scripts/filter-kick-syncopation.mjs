import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import ts from 'typescript';

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const ProjectRoot = resolve(ScriptDir, '..');
const TempDir = resolve(ProjectRoot, '.tmp-script-ts/drums');

const TsModules = [
  'src/generators/drums/fill-order.const.ts',
  'src/generators/drums/get-pattern-syncopation-score.ts',
  'src/generators/drums/weigh-kick-snare-pattern.ts',
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

const importWeighKickSnarePattern = async () => {
  await rm(TempDir, { recursive: true, force: true });
  await mkdir(TempDir, { recursive: true });

  for (const sourcePath of TsModules) {
    await compileTsModule(sourcePath);
  }

  const module = await import(pathToFileURL(resolve(TempDir, 'weigh-kick-snare-pattern.mjs')).href);

  return module.weighKickSnarePattern;
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
  const weighKickSnarePattern = await importWeighKickSnarePattern();
  const patterns = await readPatterns(sourcePath);
  const filteredPatterns = patterns.filter((pattern) => {
    const weight = weighKickSnarePattern(pattern);

    return weight.kickSyncopationScore - weight.snareSyncopationScore <= threshold;
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
