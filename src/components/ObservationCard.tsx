import {
  Bug, GitBranch, Layers, Lightbulb, Repeat2,
  Settings2, Sliders, FileText, FolderOpen, GraduationCap,
  Circle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Observation, ObservationType } from '../types/engram'
import { TypeBadge } from './TypeBadge'

const typeIcons: Record<string, LucideIcon> = {
  bugfix:          Bug,
  decision:        GitBranch,
  architecture:    Layers,
  discovery:       Lightbulb,
  pattern:         Repeat2,
  config:          Settings2,
  preference:      Sliders,
  session_summary: FileText,
  project:         FolderOpen,
  learning:        GraduationCap,
}

const typeColors: Record<string, string> = {
  bugfix:          '#F87171',
  decision:        '#60A5FA',
  architecture:    '#A78BFA',
  discovery:       '#FCD34D',
  pattern:         '#34D399',
  config:          '#FB923C',
  preference:      '#F472B6',
  session_summary: '#9CA3AF',
  project:         '#818CF8',
  learning:        '#2DD4BF',
}

function getIcon(type: ObservationType): LucideIcon {
  return typeIcons[type] ?? Circle
}

function getIconColor(type: ObservationType): string {
  return typeColors[type] ?? '#4B5470'
}

interface ObservationCardProps {
  obs: Observation
  onClick: (obs: Observation) => void
}

export function ObservationCard({ obs, onClick }: ObservationCardProps) {
  const Icon = getIcon(obs.type)
  const iconColor = getIconColor(obs.type)

  return (
    <div
      onClick={() => onClick(obs)}
      className="bg-surface border border-border p-4 flex flex-col gap-3 flex-1 cursor-pointer hover:bg-surface-hover hover:border-accent/30 transition-colors"
    >
      {/* Top row: icon + type badge + date */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color: iconColor }} strokeWidth={1.5} />
          <TypeBadge type={obs.type} />
        </div>
        <span className="font-mono text-[10px] text-muted shrink-0">
          {new Date(obs.created_at).toLocaleDateString('es-AR', {
            day: '2-digit', month: 'short', year: '2-digit',
          })}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-text leading-snug flex-1">
        {obs.title}
      </h3>

      {/* Footer: project + topic_key */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-muted">{obs.project}</span>
        {obs.topic_key && (
          <span className="font-mono text-[10px] text-muted truncate max-w-32">
            {obs.topic_key}
          </span>
        )}
      </div>
    </div>
  )
}
