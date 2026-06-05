import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ScriptDir = dirname(fileURLToPath(import.meta.url));
const ProjectRoot = resolve(ScriptDir, '..');

const PatternRegex = /^[koO-]+$/;
const SupportedFlags = new Set(['--no-x', '--breakbeat']);

const resolvePath = (path) => {
  return resolve(ProjectRoot, path);
};

const isPatternString = (value) => {
  return PatternRegex.test(value);
};

const readPatterns = async (path) => {
  const content = await readFile(path, 'utf8');

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !line.startsWith('#'));
};

const readPatternsOrPatternString = async (value) => {
  if (isPatternString(value)) {
    return [value];
  }

  return readPatterns(resolvePath(value));
};

const validatePatternLengths = (patterns, path) => {
  const patternLength = patterns[0]?.length ?? 0;
  const invalidPattern = patterns.find((pattern) => pattern.length !== patternLength);

  if (invalidPattern) {
    throw new Error(`${path} contains mixed pattern lengths`);
  }

  return patternLength;
};

const isKick = (step) => {
  return step === 'k';
};

const isMixedHit = (step) => {
  return step === 'x';
};

const isKickLike = (step) => {
  return isKick(step) || isMixedHit(step);
};

const isOffbeat = (step) => {
  return step === 'o' || step === 'O';
};

const isStrongOffbeat = (step) => {
  return step === 'O';
};

const isHit = (step) => {
  return step !== '-';
};

const hasKickLikeInRange = (pattern, startIndex, endIndex) => {
  return pattern
    .slice(startIndex, endIndex)
    .split('')
    .some((step) => isKickLike(step));
};

const makeOffbeatsWeakInRange = (steps, startIndex, endIndex, excludedIndexes = []) => {
  const excludedIndexSet = new Set(excludedIndexes);

  for (let index = startIndex; index < endIndex; index += 1) {
    if (excludedIndexSet.has(index)) {
      continue;
    }

    if (isStrongOffbeat(steps[index])) {
      steps[index] = 'o';
    }
  }
};

const applyBreakbeatOffbeatRules = (pattern) => {
  const steps = pattern.split('');

  const hasKickInMiddle = hasKickLikeInRange(pattern, 4, 12);
  const hasKickInLast = hasKickLikeInRange(pattern, 12, 16);

  if (!hasKickInMiddle) {
    makeOffbeatsWeakInRange(steps, 4, 12, [4]);
  }

  if (!hasKickInLast) {
    makeOffbeatsWeakInRange(steps, 12, 16, [12]);
  }

  return steps.join('');
};

const getMergedSteps = (leftStep, rightStep, options) => {
  if (isKick(leftStep) && isOffbeat(rightStep)) {
    return options.shouldExcludeMixedHits ? ['k', rightStep] : ['k', rightStep, 'x'];
  }

  if (isOffbeat(leftStep) && isKick(rightStep)) {
    return options.shouldExcludeMixedHits ? ['k', leftStep] : ['k', leftStep, 'x'];
  }

  if (isHit(rightStep)) {
    return [rightStep];
  }

  if (isHit(leftStep)) {
    return [leftStep];
  }

  return ['-'];
};

const combinePatterns = (leftPattern, rightPattern, options) => {
  let variants = [''];

  for (let index = 0; index < leftPattern.length; index += 1) {
    const leftStep = leftPattern[index];
    const rightStep = rightPattern[index];
    const mergedSteps = getMergedSteps(leftStep, rightStep, options);

    variants = variants.flatMap((variant) => {
      return mergedSteps.map((step) => `${variant}${step}`);
    });
  }

  if (options.shouldApplyBreakbeatRules) {
    return variants.map((pattern) => applyBreakbeatOffbeatRules(pattern));
  }

  return variants;
};

const validateFlags = (flags) => {
  const unsupportedFlag = flags.find((flag) => !SupportedFlags.has(flag));

  if (unsupportedFlag) {
    throw new Error(getUsage());
  }
};

const getUsage = () => {
  return (
    'Usage: node scripts/build-kick-offbeat-patterns.mjs ' +
    '<file1> <file2-or-pattern> <result> [--no-x] [--breakbeat]'
  );
};

const main = async () => {
  const [leftInputPath, rightInputValue, outputPath, ...flags] = process.argv.slice(2);

  if (!leftInputPath || !rightInputValue || !outputPath) {
    throw new Error(getUsage());
  }

  validateFlags(flags);

  const leftPath = resolvePath(leftInputPath);
  const resultPath = resolvePath(outputPath);
  const leftPatterns = await readPatterns(leftPath);
  const rightPatterns = await readPatternsOrPatternString(rightInputValue);
  const leftPatternLength = validatePatternLengths(leftPatterns, leftPath);
  const rightPatternLength = validatePatternLengths(rightPatterns, rightInputValue);

  if (leftPatternLength !== rightPatternLength) {
    throw new Error('Pattern files have different lengths');
  }

  const patterns = new Set();
  const options = {
    shouldExcludeMixedHits: flags.includes('--no-x'),
    shouldApplyBreakbeatRules: flags.includes('--breakbeat'),
  };

  leftPatterns.forEach((leftPattern) => {
    rightPatterns.forEach((rightPattern) => {
      combinePatterns(leftPattern, rightPattern, options).forEach((pattern) => {
        patterns.add(pattern);
      });
    });
  });

  await writeFile(resultPath, `${[...patterns].join('\n')}\n`);
  console.log(`Wrote ${patterns.size} patterns to ${resultPath}`);
};

void main();
