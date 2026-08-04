import type { Observation, Session, Stats } from '../types/engram'

const BASE = '/api'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Engram API ${res.status}: ${path}`)
  return res.json()
}

export async function fetchStats(): Promise<Stats> {
  return get<Stats>('/stats')
}

export async function fetchObservations(project?: string): Promise<Observation[]> {
  const qs = new URLSearchParams({ limit: '200' })
  if (project) qs.set('project', project)
  return get<Observation[]>(`/observations/recent?${qs}`)
}

export async function fetchSessions(): Promise<Session[]> {
  return get<Session[]>('/sessions/recent?limit=50')
}

export async function searchObservations(q: string): Promise<Observation[]> {
  return get<Observation[]>(`/search?q=${encodeURIComponent(q)}&limit=50`)
}
