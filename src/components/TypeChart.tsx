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
    <div className="px-6 py-4 border-b border-border bg-surface/50">
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">distribución</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-2">
        {sorted.map(([type, count]) => {
          const isActive = selectedType === type
          return (
            <button
              key={type}
              onClick={() => onTypeClick(type)}
              className={`flex items-center gap-2 group text-left transition-opacity ${
                selectedType && !isActive ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <div className="shrink-0"><TypeBadge type={type} /></div>
              <div className="flex-1 min-w-0 flex items-center gap-1.5">
                <div className="flex-1 bg-border rounded-none h-px overflow-hidden">
                  <div
                    className={`h-full transition-all ${isActive ? 'bg-accent' : 'bg-muted group-hover:bg-accent/60'}`}
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-muted w-4 text-right shrink-0">{count}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
