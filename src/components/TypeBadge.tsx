import type { ObservationType } from '../types/engram'

const typeColors: Record<string, { border: string; text: string; bg: string }> = {
  bugfix:          { border: '#EF4444', text: '#F87171', bg: 'rgba(239,68,68,0.08)' },
  decision:        { border: '#3B82F6', text: '#60A5FA', bg: 'rgba(59,130,246,0.08)' },
  architecture:    { border: '#8B5CF6', text: '#A78BFA', bg: 'rgba(139,92,246,0.08)' },
  discovery:       { border: '#F59E0B', text: '#FCD34D', bg: 'rgba(245,158,11,0.08)' },
  pattern:         { border: '#10B981', text: '#34D399', bg: 'rgba(16,185,129,0.08)' },
  config:          { border: '#F97316', text: '#FB923C', bg: 'rgba(249,115,22,0.08)' },
  preference:      { border: '#EC4899', text: '#F472B6', bg: 'rgba(236,72,153,0.08)' },
  session_summary: { border: '#6B7280', text: '#9CA3AF', bg: 'rgba(107,114,128,0.08)' },
  project:         { border: '#6366F1', text: '#818CF8', bg: 'rgba(99,102,241,0.08)' },
  learning:        { border: '#14B8A6', text: '#2DD4BF', bg: 'rgba(20,184,166,0.08)' },
}

const fallback = { border: '#4B5470', text: '#6B7280', bg: 'rgba(75,84,112,0.08)' }

interface TypeBadgeProps {
  type: ObservationType
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const colors = typeColors[type] ?? fallback
  return (
    <span
      style={{
        borderLeftColor: colors.border,
        color: colors.text,
        backgroundColor: colors.bg,
      }}
      className="inline-flex items-center font-mono text-[10px] leading-none px-1.5 py-1 border-l-2 tracking-wide"
    >
      {type}
    </span>
  )
}
