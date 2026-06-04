import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import ts from 'typescript';

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const ProjectRoot = resolve(ScriptDir, '..');
const DefaultOutputPath = resolve(ProjectRoot, 'src/generators/drums/relative-kick-snare-patterns.ts');
const TempDir = resolve(ProjectRoot, '.tmp-script-ts/drums-relative');
const TsModules = [
  'src/generators/drums/count-pattern-beats.ts',
  'src/generators/drums/new-syncope-grade.ts',
  'src/generators/drums/weigh-kick-snare-pattern.ts',
  'src/generators/drums/kick-snare-patterns.ts',
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

const importKickSnarePatterns = async () => {
  await rm(TempDir, { recursive: true, force: true });
  await mkdir(TempDir, { recursive: true });

  for (const sourcePath of TsModules) {
    await compileTsModule(sourcePath);
  }

  const module = await import(pathToFileURL(resolve(TempDir, 'kick-snare-patterns.mjs')).href);

  await rm(TempDir, { recursive: true, force: true });

  return module.KickSnarePatterns;
};

const getPatternDiff = (sourcePattern, targetPattern) => {
  const diff = {
    addedBeatCount: 0,
    removedBeatCount: 0,
  };

  for (let index = 0; index < sourcePattern.length; index += 1) {
    const sourceStep = sourcePattern[index];
    const targetStep = targetPattern[index];

    if (sourceStep === targetStep) {
      continue;
    }

    if (sourceStep !== '-') {
      diff.removedBeatCount += 1;
    }

    if (targetStep !== '-') {
      diff.addedBeatCount += 1;
    }
  }

  return diff;
};

const isPatternFamilyMember = (sourcePattern, targetPattern) => {
  if (sourcePattern.length !== targetPattern.length) {
    return false;
  }

  const diff = getPatternDiff(sourcePattern, targetPattern);

  return diff.addedBeatCount <= 1 && diff.removedBeatCount <= 1;
};

const buildRelativePatterns = (patterns) => {
  return Object.fromEntries(
    patterns.map((sourcePattern) => [
      sourcePattern,
      patterns.filter((targetPattern) => isPatternFamilyMember(sourcePattern, targetPattern)),
    ]),
  );
};

const formatRelativePatternsModule = (relativePatterns, exportName) => {
  return `export const ${exportName}: Record<string, string[]> = ${JSON.stringify(
    relativePatterns,
    null,
    2,
  )};\n`;
};

const main = async () => {
  const [inputPath, outputPath, exportName = 'RelativeKickSnarePatterns'] = process.argv.slice(2);
  const patterns = inputPath ? await readPatterns(resolvePath(inputPath)) : await importKickSnarePatterns();
  const relativePatterns = buildRelativePatterns(patterns);
  const resultPath = outputPath ? resolvePath(outputPath) : DefaultOutputPath;

  await writeFile(resultPath, formatRelativePatternsModule(relativePatterns, exportName));
  console.log(`Wrote relative patterns for ${patterns.length} patterns to ${resultPath}`);
};

void main();
