import { useEffect, useState, useMemo } from 'react'
import type { Observation, Stats, PendingItem } from './types/engram'
import { fetchStats, fetchObservations, searchObservations } from './api/engram'
import { extractPendingItems } from './lib/parsePending'
import { StatCard } from './components/StatCard'
import { ObservationCard } from './components/ObservationCard'
import { TypeBadge } from './components/TypeBadge'
import './index.css'

type Tab = 'observaciones' | 'pendientes'

const ALL_PROJECTS = 'Todos'

export default function App() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [observations, setObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<Tab>('observaciones')
  const [selectedProject, setSelectedProject] = useState(ALL_PROJECTS)
  const [selectedType, setSelectedType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Observation[] | null>(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    Promise.all([fetchStats(), fetchObservations()])
      .then(([s, obs]) => {
        setStats(s)
        setObservations(obs)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const projects = stats ? [ALL_PROJECTS, ...stats.projects] : [ALL_PROJECTS]

  const allTypes = useMemo(() => {
    const types = [...new Set(observations.map(o => o.type))]
    return types.sort()
  }, [observations])

  const filtered = useMemo(() => {
    let list = searchResults ?? observations
    if (selectedProject !== ALL_PROJECTS) list = list.filter(o => o.project === selectedProject)
    if (selectedType) list = list.filter(o => o.type === selectedType)
    return list
  }, [observations, searchResults, selectedProject, selectedType])

  const pendingItems = useMemo((): PendingItem[] => {
    const list = selectedProject !== ALL_PROJECTS
      ? observations.filter(o => o.project === selectedProject)
      : observations
    return extractPendingItems(list)
  }, [observations, selectedProject])

  async function handleSearch(q: string) {
    setSearchQuery(q)
    if (!q.trim()) { setSearchResults(null); return }
    setSearching(true)
    try {
      const results = await searchObservations(q)
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
      <span className="text-zinc-400 text-sm">Conectando con Engram...</span>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center flex-col gap-3">
      <span className="text-red-500 font-semibold">No se pudo conectar con Engram</span>
      <span className="text-zinc-400 text-sm">{error}</span>
      <p className="text-zinc-400 text-xs">Asegurate de tener corriendo: <code className="bg-zinc-800 text-zinc-200 px-2 py-1 rounded">engram serve</code></p>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
          <span className="font-bold text-zinc-900 dark:text-white text-sm tracking-wide">engram</span>
          <span className="text-zinc-400 text-xs ml-1">explorer</span>
        </div>

        <nav className="p-2 flex flex-col gap-1">
          {(['observaciones', 'pendientes'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white font-medium'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {tab === 'pendientes' ? `pendientes (${pendingItems.length})` : tab}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-100 dark:border-zinc-700 mt-2">
          <p className="text-xs text-zinc-400 font-medium mb-2 uppercase tracking-wider px-1">Proyectos</p>
          <div className="flex flex-col gap-0.5">
            {projects.map(p => (
              <button
                key={p}
                onClick={() => setSelectedProject(p)}
                className={`text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedProject === p
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-base font-semibold text-zinc-900 dark:text-white capitalize">
            {activeTab === 'pendientes'
              ? 'Pendientes'
              : selectedProject === ALL_PROJECTS
                ? 'Todas las observaciones'
                : selectedProject}
          </h1>
          {activeTab === 'observaciones' && (
            <input
              type="search"
              placeholder="Buscar en Engram..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="w-64 text-sm px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </header>

        {stats && (
          <div className="px-6 py-3 grid grid-cols-3 gap-3 border-b border-zinc-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800/50">
            <StatCard label="Sesiones" value={stats.total_sessions} />
            <StatCard label="Observaciones" value={stats.total_observations} />
            <StatCard label="Prompts" value={stats.total_prompts} />
          </div>
        )}

        {activeTab === 'observaciones' && (
          <div className="px-6 py-3 flex flex-wrap gap-2 border-b border-zinc-100 dark:border-zinc-700/50 bg-white dark:bg-zinc-800/30">
            <button
              onClick={() => setSelectedType('')}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                !selectedType
                  ? 'border-zinc-900 dark:border-zinc-200 text-zinc-900 dark:text-zinc-200 font-medium'
                  : 'border-zinc-200 dark:border-zinc-600 text-zinc-500 hover:border-zinc-400'
              }`}
            >
              todos ({filtered.length})
            </button>
            {allTypes.map(type => {
              const count = (searchResults ?? observations).filter(
                o => o.type === type && (selectedProject === ALL_PROJECTS || o.project === selectedProject)
              ).length
              if (count === 0) return null
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(t => t === type ? '' : type)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-colors ${
                    selectedType === type
                      ? 'border-zinc-900 dark:border-zinc-200 font-medium'
                      : 'border-zinc-200 dark:border-zinc-600 text-zinc-500 hover:border-zinc-400'
                  }`}
                >
                  <TypeBadge type={type} /> ({count})
                </button>
              )
            })}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'observaciones' && (
            <>
              {searching && <p className="text-sm text-zinc-400 mb-4">Buscando...</p>}
              {searchResults !== null && !searching && (
                <p className="text-sm text-zinc-400 mb-4">{searchResults.length} resultados para "{searchQuery}"</p>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(obs => (
                  <ObservationCard key={obs.id} obs={obs} />
                ))}
              </div>
              {filtered.length === 0 && (
                <p className="text-zinc-400 text-sm text-center mt-12">No hay observaciones para este filtro.</p>
              )}
            </>
          )}

          {activeTab === 'pendientes' && (
            <div className="max-w-2xl flex flex-col gap-3">
              {pendingItems.length === 0 ? (
                <p className="text-zinc-400 text-sm">No se encontraron next steps en los session summaries.</p>
              ) : (
                pendingItems.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex items-start gap-3"
                  >
                    <div className="mt-0.5 w-4 h-4 shrink-0 rounded border-2 border-zinc-300 dark:border-zinc-600" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-zinc-800 dark:text-zinc-200">{item.text}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-500 font-medium">{item.project}</span>
                        <span className="text-xs text-zinc-400">
                          {new Date(item.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
