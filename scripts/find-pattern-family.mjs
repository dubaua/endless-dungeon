import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import ts from 'typescript';

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const ProjectRoot = resolve(ScriptDir, '..');
const DefaultOutputPath = resolve(
  ProjectRoot,
  'src/generators/drums/relative-kick-offbeat-patterns.ts',
);
const TempDir = resolve(ProjectRoot, '.tmp-script-ts/drums-relative');
const TsModules = [
  'src/generators/drums/count-pattern-beats.ts',
  'src/generators/drums/new-syncope-grade.ts',
  'src/generators/drums/weigh-kick-offbeat-pattern.ts',
  'src/generators/drums/kick-offbeat-patterns.ts',
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

const importKickOffbeatPatterns = async () => {
  await rm(TempDir, { recursive: true, force: true });
  await mkdir(TempDir, { recursive: true });

  for (const sourcePath of TsModules) {
    await compileTsModule(sourcePath);
  }

  const module = await import(pathToFileURL(resolve(TempDir, 'kick-offbeat-patterns.mjs')).href);

  await rm(TempDir, { recursive: true, force: true });

  return module.KickOffbeatPatterns;
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

const isPatternFamilyMember = (sourcePattern, targetPattern, distance) => {
  if (sourcePattern.length !== targetPattern.length) {
    return false;
  }

  const diff = getPatternDiff(sourcePattern, targetPattern);

  return (
    (diff.addedBeatCount === 0 && diff.removedBeatCount === distance) ||
    (diff.addedBeatCount === distance && diff.removedBeatCount === 0)
  );
};

const buildRelativePatterns = (patterns) => {
  return Object.fromEntries(
    patterns.map((sourcePattern) => {
      const relativePatterns = patterns.filter((targetPattern) =>
        isPatternFamilyMember(sourcePattern, targetPattern, 1),
      );

      return [
        sourcePattern,
        relativePatterns.length > 0
          ? relativePatterns
          : patterns.filter((targetPattern) => isPatternFamilyMember(sourcePattern, targetPattern, 2)),
      ];
    }),
  );
};

const formatRelativePatternsModule = (relativePatterns, exportName) => {
  return `import type { RelativeBeatPatterns } from './relative-beat-pattern.type';\n\nexport const ${exportName}: Record<string, RelativeBeatPatterns> = ${JSON.stringify(
    relativePatterns,
    null,
    2,
  )};\n`;
};

const main = async () => {
  const [inputPath, outputPath, exportName = 'RelativeKickOffbeatPatterns'] = process.argv.slice(2);
  const patterns = inputPath
    ? await readPatterns(resolvePath(inputPath))
    : await importKickOffbeatPatterns();
  const relativePatterns = buildRelativePatterns(patterns);
  const resultPath = outputPath ? resolvePath(outputPath) : DefaultOutputPath;

  await writeFile(resultPath, formatRelativePatternsModule(relativePatterns, exportName));
  console.log(`Wrote relative patterns for ${patterns.length} patterns to ${resultPath}`);
};

void main();
