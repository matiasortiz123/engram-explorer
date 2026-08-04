import type { Session } from '../types/engram'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
    return <p className="text-zinc-400 text-sm text-center mt-12">No hay sesiones para este proyecto.</p>
  }

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(byProject).map(([project, projectSessions]) => (
        <div key={project} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">{project}</h2>
          <div className="flex flex-col gap-2">
            {projectSessions.map(session => (
              <div
                key={session.id}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-mono text-zinc-600 dark:text-zinc-300 truncate">
                    {session.id}
                  </span>
                  <span className="text-xs text-zinc-400">{formatDate(session.started_at)}</span>
                </div>
                <div className="shrink-0 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium px-3 py-1 rounded-full">
                  {session.observation_count} obs
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
