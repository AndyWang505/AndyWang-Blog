export const TAG_COLORS = [
  'text-red-500 hover:text-red-600',
  'text-blue-500 hover:text-blue-600',
  'text-green-500 hover:text-green-600',
  'text-yellow-500 hover:text-yellow-600',
  'text-purple-500 hover:text-purple-600',
  'text-pink-500 hover:text-pink-600',
  'text-indigo-500 hover:text-indigo-600',
  'text-teal-500 hover:text-teal-600'
] as const;

export function getRandomTagColor(): string {
  return TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}
