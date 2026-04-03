export function calculateTagSize(count: number, sortedCounts: number[]): string {
  if (count <= 2) return 'text-sm';
  if (count <= 4) return 'text-base';

  const index = sortedCounts.findIndex((n) => n >= count);
  const percentile = (index / sortedCounts.length) * 100;

  if (percentile <= 85) return 'text-lg';
  return 'text-xl';
}
