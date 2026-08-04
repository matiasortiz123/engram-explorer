import { useState } from 'react'
import type { Observation } from '../types/engram'
import { TypeBadge } from './TypeBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

interface ObservationCardProps {
  obs: Observation
}

export function ObservationCard({ obs }: ObservationCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={obs.type} />
          <span className="text-xs text-zinc-400">{obs.project}</span>
        </div>
        <span className="text-xs text-zinc-400 shrink-0">{formatDate(obs.created_at)}</span>
      </div>

      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
        {obs.title}
      </h3>

      {obs.content && (
        <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {expanded ? (
            <pre className="whitespace-pre-wrap font-sans">{obs.content}</pre>
          ) : (
            <p className="line-clamp-2">{obs.content.replace(/\*\*|##/g, '')}</p>
          )}
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-1 text-blue-500 hover:text-blue-600 text-xs"
          >
            {expanded ? 'Ver menos' : 'Ver más'}
          </button>
        </div>
      )}
    </div>
  )
}
