import type { Observation } from '../types/engram'
import { TypeBadge } from './TypeBadge'

interface ObservationCardProps {
  obs: Observation
  onClick: (obs: Observation) => void
}

export function ObservationCard({ obs, onClick }: ObservationCardProps) {
  return (
    <div
      onClick={() => onClick(obs)}
      className="bg-surface border border-border p-4 flex flex-col gap-3 cursor-pointer hover:bg-surface-hover hover:border-accent/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <TypeBadge type={obs.type} />
        <span className="font-mono text-[10px] text-muted shrink-0">
          {new Date(obs.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
      </div>

      <h3 className="text-sm font-medium text-text leading-snug">
        {obs.title}
      </h3>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted">{obs.project}</span>
        {obs.topic_key && (
          <span className="font-mono text-[10px] text-muted truncate max-w-32">{obs.topic_key}</span>
        )}
      </div>
    </div>
  )
}
