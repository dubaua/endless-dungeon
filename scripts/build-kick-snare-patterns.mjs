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

const validatePatternLengths = (patterns, path) => {
  const patternLength = patterns[0]?.length ?? 0;
  const invalidPattern = patterns.find((pattern) => pattern.length !== patternLength);

  if (invalidPattern) {
    throw new Error(`${path} contains mixed pattern lengths`);
  }

  return patternLength;
};

const combinePatterns = (leftPattern, rightPattern) => {
  const combined = [];

  for (let index = 0; index < leftPattern.length; index += 1) {
    const leftStep = leftPattern[index];
    const rightStep = rightPattern[index];

    if (rightStep !== '-') {
      combined.push(rightStep);
    } else if (leftStep !== '-') {
      combined.push(leftStep);
    } else {
      combined.push('-');
    }
  }

  return combined.join('');
};

const hasConsecutiveHits = (pattern) => {
  return [...pattern].some((step, index) => {
    if (index === 0 || step === '-') {
      return false;
    }

    return pattern[index - 1] !== '-';
  });
};

const isSupportedFlag = (flag) => {
  if (!flag) {
    return true;
  }

  return flag === '--no-consecutive';
};

const getUsage = () => {
  return (
    'Usage: node scripts/build-kick-snare-patterns.mjs ' +
    '<file1> <file2> <result> [--no-consecutive]'
  );
};

const main = async () => {
  const [leftInputPath, rightInputPath, outputPath, flag] = process.argv.slice(2);
  const shouldExcludeConsecutiveHits = flag === '--no-consecutive';

  if (!leftInputPath || !rightInputPath || !outputPath) {
    throw new Error(getUsage());
  }

  if (!isSupportedFlag(flag)) {
    throw new Error(getUsage());
  }

  const leftPath = resolvePath(leftInputPath);
  const rightPath = resolvePath(rightInputPath);
  const resultPath = resolvePath(outputPath);
  const leftPatterns = await readPatterns(leftPath);
  const rightPatterns = await readPatterns(rightPath);
  const leftPatternLength = validatePatternLengths(leftPatterns, leftPath);
  const rightPatternLength = validatePatternLengths(rightPatterns, rightPath);

  if (leftPatternLength !== rightPatternLength) {
    throw new Error('Pattern files have different lengths');
  }

  const patterns = new Set();

  leftPatterns.forEach((leftPattern) => {
    rightPatterns.forEach((rightPattern) => {
      const pattern = combinePatterns(leftPattern, rightPattern);

      if (pattern && (!shouldExcludeConsecutiveHits || !hasConsecutiveHits(pattern))) {
        patterns.add(pattern);
      }
    });
  });

  await writeFile(resultPath, `${[...patterns].join('\n')}\n`);
  console.log(`Wrote ${patterns.size} patterns to ${resultPath}`);
};

void main();
