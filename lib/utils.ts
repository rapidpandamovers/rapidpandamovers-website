/**
 * Pick evenly spaced items from an array for a deterministic subset.
 */
export function pickSpread<T>(array: T[], count: number): T[] {
  if (array.length <= count) return array
  const step = array.length / count
  return Array.from({ length: count }, (_, i) => array[Math.floor(i * step)])
}

/**
 * Return the most recent reviews sorted by date descending.
 */
export function latestReviews<T extends { date: string }>(reviews: T[], count: number): T[] {
  return [...reviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)
}
