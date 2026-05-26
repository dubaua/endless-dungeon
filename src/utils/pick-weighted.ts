export interface WeightedOption<T> {
  value: T;
  weight: number;
}

export type WeightedOptions<T> = WeightedOption<T>[];
export type RandomSource = () => number;

export const pickWeighted = <T>(
  options: WeightedOptions<T>,
  random: RandomSource = Math.random,
): T => {
  const validOptions = options.filter((option) => option.weight > 0);

  if (validOptions.length === 0) {
    throw new Error('Cannot pick weighted option from an empty weight set');
  }

  const totalWeight = validOptions.reduce((sum, option) => sum + option.weight, 0);
  let threshold = random() * totalWeight;

  for (const option of validOptions) {
    threshold -= option.weight;

    if (threshold < 0) {
      return option.value;
    }
  }

  return validOptions[validOptions.length - 1].value;
};
