import type { Observation } from '../types/engram'
import { TypeBadge } from './TypeBadge'

interface TypeChartProps {
  observations: Observation[]
  onTypeClick: (type: string) => void
}

export function TypeChart({ observations, onTypeClick }: TypeChartProps) {
  const counts = observations.reduce<Record<string, number>>((acc, o) => {
    acc[o.type] = (acc[o.type] ?? 0) + 1
    return acc
  }, {})

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const max = sorted[0]?.[1] ?? 1

  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col gap-3">
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Por tipo</span>
      <div className="flex flex-col gap-2">
        {sorted.map(([type, count]) => (
          <button
            key={type}
            onClick={() => onTypeClick(type)}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-24 shrink-0">
              <TypeBadge type={type} />
            </div>
            <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-zinc-400 dark:bg-zinc-400 rounded-full transition-all group-hover:bg-blue-500"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 w-5 text-right shrink-0">
              {count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
