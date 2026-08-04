import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Observation } from '../types/engram'
import { TypeBadge } from './TypeBadge'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface ObservationModalProps {
  obs: Observation | null
  onClose: () => void
}

export function ObservationModal({ obs, onClose }: ObservationModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!obs) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-2xl h-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={obs.type} />
              <span className="text-xs text-zinc-400">{obs.project}</span>
            </div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              {obs.title}
            </h2>
            <span className="text-xs text-zinc-400">{formatDate(obs.created_at)}</span>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {obs.content}
            </ReactMarkdown>
          </div>
        </div>

        {obs.topic_key && (
          <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-700">
            <span className="text-xs text-zinc-400">topic: </span>
            <code className="text-xs text-zinc-500 dark:text-zinc-400">{obs.topic_key}</code>
          </div>
        )}
      </div>
    </div>
  )
}
