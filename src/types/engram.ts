export type ObservationType =
  | 'bugfix'
  | 'decision'
  | 'architecture'
  | 'discovery'
  | 'pattern'
  | 'config'
  | 'preference'
  | 'session_summary'
  | 'project'
  | 'learning'
  | string

export interface Observation {
  id: number
  sync_id: string
  session_id: string
  type: ObservationType
  title: string
  content: string
  project: string
  scope: string
  topic_key: string | null
  revision_count: number
  duplicate_count: number
  last_seen_at: string | null
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  project: string
  started_at: string
  ended_at?: string
  observation_count: number
}

export interface Stats {
  total_sessions: number
  total_observations: number
  total_prompts: number
  projects: string[]
}

export interface PendingItem {
  text: string
  sourceObservationId: number
  project: string
  date: string
}
