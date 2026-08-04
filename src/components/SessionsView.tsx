import type { Session } from '../types/engram'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

interface SessionsViewProps {
  sessions: Session[]
  selectedProject: string
}

const ALL_PROJECTS = 'Todos'

export function SessionsView({ sessions, selectedProject }: SessionsViewProps) {
  const filtered = selectedProject === ALL_PROJECTS
    ? sessions
    : sessions.filter(s => s.project === selectedProject)

  const byProject = filtered.reduce<Record<string, Session[]>>((acc, s) => {
    acc[s.project] = [...(acc[s.project] ?? []), s]
    return acc
  }, {})

  if (filtered.length === 0) {
    return <p className="font-mono text-xs text-muted text-center mt-12">// no sessions found</p>
  }

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(byProject).map(([project, projectSessions]) => (
        <div key={project} className="flex flex-col gap-2">
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1">{project}</p>
          {projectSessions.map(session => (
            <div
              key={session.id}
              className="bg-surface border border-border p-4 flex items-center justify-between gap-4 hover:bg-surface-hover transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-mono text-xs text-text truncate">{session.id}</span>
                <span className="font-mono text-[10px] text-muted">{formatDate(session.started_at)}</span>
              </div>
              <span className="font-mono text-[10px] text-accent border border-accent/30 px-2 py-1 shrink-0">
                {session.observation_count} obs
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
