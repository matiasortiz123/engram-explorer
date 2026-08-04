import type { Observation, PendingItem } from '../types/engram'

export function extractPendingItems(observations: Observation[]): PendingItem[] {
  const items: PendingItem[] = []

  const summaries = observations.filter(o => o.type === 'session_summary')

  for (const obs of summaries) {
    const match = obs.content.match(/##\s*Next Steps\s*\n([\s\S]*?)(?=\n##|$)/i)
    if (!match) continue

    const lines = match[1]
      .split('\n')
      .map(l => l.replace(/^[-*]\s*/, '').trim())
      .filter(l => l.length > 0)

    for (const text of lines) {
      items.push({
        text,
        sourceObservationId: obs.id,
        project: obs.project,
        date: obs.created_at,
      })
    }
  }

  return items
}
