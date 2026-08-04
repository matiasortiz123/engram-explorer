import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Observation } from '../types/engram'
import { TypeBadge } from './TypeBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

interface ObservationModalProps {
  obs: Observation | null
  onClose: () => void
}

export function ObservationModal({ obs, onClose }: ObservationModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!obs) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative ml-auto w-full max-w-2xl h-full bg-surface border-l border-border shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={obs.type} />
              <span className="font-mono text-[10px] text-muted">{obs.project}</span>
            </div>
            <h2 className="text-base font-medium text-text leading-snug">{obs.title}</h2>
            <span className="font-mono text-[10px] text-muted">{formatDate(obs.created_at)}</span>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 font-mono text-muted hover:text-text transition-colors text-sm"
          >
            [esc]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm prose-invert max-w-none
            prose-headings:font-mono prose-headings:text-text prose-headings:font-medium
            prose-p:text-text/80 prose-p:leading-relaxed
            prose-strong:text-text prose-strong:font-medium
            prose-code:font-mono prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1 prose-code:rounded-none
            prose-li:text-text/80
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{obs.content}</ReactMarkdown>
          </div>
        </div>

        {obs.topic_key && (
          <div className="px-6 py-3 border-t border-border">
            <span className="font-mono text-[10px] text-muted">topic_key: </span>
            <span className="font-mono text-[10px] text-accent">{obs.topic_key}</span>
          </div>
        )}
      </div>
    </div>
  )
}
