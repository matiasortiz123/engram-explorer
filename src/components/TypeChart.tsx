import type { Observation } from '../types/engram'
import { TypeBadge } from './TypeBadge'

interface TypeChartProps {
  observations: Observation[]
  selectedType: string
  onTypeClick: (type: string) => void
}

export function TypeChart({ observations, selectedType, onTypeClick }: TypeChartProps) {
  const counts = observations.reduce<Record<string, number>>((acc, o) => {
    acc[o.type] = (acc[o.type] ?? 0) + 1
    return acc
  }, {})

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const max = sorted[0]?.[1] ?? 1

  if (sorted.length === 0) return null

  return (
    <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800/30">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Distribución por tipo</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-2">
        {sorted.map(([type, count]) => {
          const isActive = selectedType === type
          return (
            <button
              key={type}
              onClick={() => onTypeClick(type)}
              className={`flex items-center gap-2 group text-left transition-opacity ${
                selectedType && !isActive ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <div className="shrink-0">
                <TypeBadge type={type} />
              </div>
              <div className="flex-1 min-w-0 flex items-center gap-1.5">
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isActive ? 'bg-blue-500' : 'bg-zinc-400 dark:bg-zinc-500 group-hover:bg-blue-400'}`}
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 shrink-0 w-4 text-right">{count}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
