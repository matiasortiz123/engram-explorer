interface StatCardProps {
  label: string
  value: number | string
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-surface border border-border p-4 flex flex-col gap-1">
      <span className="font-mono text-2xl font-medium text-text">{value}</span>
      <span className="text-xs text-muted uppercase tracking-wider">{label}</span>
    </div>
  )
}
