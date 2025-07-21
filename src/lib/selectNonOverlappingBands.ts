import { Band } from '../types/supabase'

export function selectNonOverlappingBands(possibleBands: Band[]): Band[] {
  const finalBands: Band[] = []
  const usedUserIds = new Set<string>()

  for (const band of possibleBands) {
    const hasOverlap = band.some(member => usedUserIds.has(member.id))
    if (hasOverlap) continue

    band.forEach(member => usedUserIds.add(member.id))
    finalBands.push(band)
  }

  return finalBands
}
