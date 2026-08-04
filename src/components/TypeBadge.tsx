import type { ObservationType } from '../types/engram'

const colorMap: Record<string, string> = {
  bugfix: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  decision: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  architecture: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  discovery: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  pattern: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  config: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  preference: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  session_summary: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300',
  project: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
  learning: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
}

interface TypeBadgeProps {
  type: ObservationType
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const cls = colorMap[type] ?? 'bg-zinc-100 text-zinc-600'
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {type}
    </span>
  )
}
