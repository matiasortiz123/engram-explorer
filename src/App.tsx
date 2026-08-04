import { useEffect, useState, useMemo, useCallback } from 'react'
import type { Observation, Session, Stats, PendingItem } from './types/engram'
import { fetchStats, fetchObservations, fetchSessions, searchObservations } from './api/engram'
import { extractPendingItems } from './lib/parsePending'
import { StatCard } from './components/StatCard'
import { ObservationCard } from './components/ObservationCard'
import { ObservationModal } from './components/ObservationModal'
import { TypeChart } from './components/TypeChart'
import { SessionsView } from './components/SessionsView'
import './index.css'

type Tab = 'observaciones' | 'sesiones' | 'pendientes'

const ALL_PROJECTS = 'Todos'
const REFRESH_INTERVAL = 30_000

export default function App() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [observations, setObservations] = useState<Observation[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const [activeTab, setActiveTab] = useState<Tab>('observaciones')
  const [selectedProject, setSelectedProject] = useState(ALL_PROJECTS)
  const [selectedType, setSelectedType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Observation[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [selectedObs, setSelectedObs] = useState<Observation | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [s, obs, sess] = await Promise.all([fetchStats(), fetchObservations(), fetchSessions()])
      setStats(s)
      setObservations(obs)
      setSessions(sess)
      setLastRefresh(new Date())
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [loadData])

  const projects = stats ? [ALL_PROJECTS, ...stats.projects] : [ALL_PROJECTS]

  const baseList = useMemo(() => {
    const list = searchResults ?? observations
    return selectedProject === ALL_PROJECTS ? list : list.filter(o => o.project === selectedProject)
  }, [observations, searchResults, selectedProject])

  const filtered = useMemo(() => {
    return selectedType ? baseList.filter(o => o.type === selectedType) : baseList
  }, [baseList, selectedType])

  const pendingItems = useMemo((): PendingItem[] => {
    const list = selectedProject === ALL_PROJECTS
      ? observations
      : observations.filter(o => o.project === selectedProject)
    return extractPendingItems(list)
  }, [observations, selectedProject])

  const pendingByProject = useMemo(() => {
    return pendingItems.reduce<Record<string, PendingItem[]>>((acc, item) => {
      acc[item.project] = [...(acc[item.project] ?? []), item]
      return acc
    }, {})
  }, [pendingItems])

  async function handleSearch(q: string) {
    setSearchQuery(q)
    if (!q.trim()) { setSearchResults(null); return }
    setSearching(true)
    try {
      setSearchResults(await searchObservations(q))
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  function handleTypeClick(type: string) {
    setActiveTab('observaciones')
    setSelectedType(t => t === type ? '' : type)
  }

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <span className="font-mono text-xs text-muted">connecting to engram...</span>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-bg flex items-center justify-center flex-col gap-3">
      <span className="font-mono text-xs text-red-500">// connection failed</span>
      <span className="font-mono text-[10px] text-muted">{error}</span>
      <span className="font-mono text-[10px] text-muted mt-2">
        run: <span className="text-accent">engram serve</span>
      </span>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-border bg-surface flex flex-col">
        <div className="p-4 border-b border-border">
          <span className="font-mono text-sm font-medium text-text">engram</span>
          <span className="font-mono text-xs text-muted ml-1">/ explorer</span>
        </div>

        <nav className="p-2 flex flex-col gap-0.5 mt-1">
          {(['observaciones', 'sesiones', 'pendientes'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-3 py-2 text-xs font-mono transition-colors ${
                activeTab === tab
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:text-text hover:bg-surface-hover'
              }`}
            >
              {tab === 'pendientes' ? `${tab} (${pendingItems.length})` : tab}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border mt-3">
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2 px-1">proyectos</p>
          <div className="flex flex-col gap-0.5">
            {projects.map(p => (
              <button
                key={p}
                onClick={() => setSelectedProject(p)}
                className={`text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                  selectedProject === p
                    ? 'text-accent bg-accent/10'
                    : 'text-muted hover:text-text hover:bg-surface-hover'
                }`}
              >
                {selectedProject === p ? '> ' : '  '}{p}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-3 border-t border-border">
          <p className="font-mono text-[10px] text-muted">
            sync {lastRefresh.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between gap-4">
          <span className="font-mono text-xs text-muted">
            {activeTab === 'pendientes' ? 'pendientes'
              : activeTab === 'sesiones' ? 'sesiones'
              : selectedProject === ALL_PROJECTS ? 'todas las observaciones'
              : selectedProject}
          </span>
          {activeTab === 'observaciones' && (
            <input
              type="search"
              placeholder="buscar..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-56 font-mono text-xs px-3 py-1.5 bg-bg border border-border text-text placeholder-muted focus:outline-none focus:border-accent/50"
            />
          )}
        </header>

        {stats && (
          <div className="grid grid-cols-3 border-b border-border">
            <StatCard label="sesiones" value={stats.total_sessions} />
            <StatCard label="observaciones" value={stats.total_observations} />
            <StatCard label="prompts" value={stats.total_prompts} />
          </div>
        )}

        {activeTab === 'observaciones' && (
          <TypeChart observations={baseList} selectedType={selectedType} onTypeClick={handleTypeClick} />
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'observaciones' && (
            <>
              {searching && <p className="font-mono text-xs text-muted mb-4">// searching...</p>}
              {searchResults !== null && !searching && (
                <p className="font-mono text-xs text-muted mb-4">
                  // {searchResults.length} results for "{searchQuery}"
                </p>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-px bg-border">
                {filtered.map(obs => (
                  <div key={obs.id} className="bg-bg flex flex-col">
                    <ObservationCard obs={obs} onClick={setSelectedObs} />
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <p className="font-mono text-xs text-muted text-center mt-12">// no observations found</p>
              )}
            </>
          )}

          {activeTab === 'sesiones' && (
            <SessionsView sessions={sessions} selectedProject={selectedProject} />
          )}

          {activeTab === 'pendientes' && (
            <div className="flex flex-col gap-8 max-w-2xl">
              {pendingItems.length === 0 ? (
                <p className="font-mono text-xs text-muted">// no next steps found in session summaries</p>
              ) : (
                Object.entries(pendingByProject).map(([project, items]) => (
                  <div key={project} className="flex flex-col gap-2">
                    <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1">{project}</p>
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="bg-surface border border-border p-4 flex items-start gap-3 hover:bg-surface-hover transition-colors"
                      >
                        <div className="mt-1 w-3 h-3 shrink-0 border border-muted" />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-text leading-relaxed">{item.text}</p>
                          <span className="font-mono text-[10px] text-muted">
                            {new Date(item.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <ObservationModal obs={selectedObs} onClose={() => setSelectedObs(null)} />
    </div>
  )
}
