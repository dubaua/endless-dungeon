export const getPatternSyncopationScore = (
  pattern: string,
  beat: string,
  fillOrder: readonly number[],
): number => {
  const activeStepOrderIndexes = [...pattern]
    .map((step, index) => (step === beat ? fillOrder.indexOf(index) : -1))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right);

  return activeStepOrderIndexes.reduce((score, orderIndex, index) => {
    return score + Math.abs(orderIndex - index);
  }, 0);
};
