export type RandomSource = () => number;
export type WeightedGraph<TNode extends string> = Partial<Record<TNode, number>>;

export const generateByGraph = <TNode extends string>(
  graph: WeightedGraph<TNode>,
  random: RandomSource = Math.random,
): TNode => {
  const nodes = Object.keys(graph) as TNode[];
  const totalWeight = nodes.reduce((sum, node) => sum + (graph[node] ?? 0), 0);

  if (totalWeight <= 0) {
    const index = Math.floor(random() * nodes.length);
    return nodes[index] ?? nodes[0];
  }

  let threshold = random() * totalWeight;

  for (const node of nodes) {
    threshold -= graph[node] ?? 0;

    if (threshold < 0) {
      return node;
    }
  }

  return nodes[nodes.length - 1] ?? nodes[0];
};
