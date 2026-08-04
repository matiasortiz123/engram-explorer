interface StatCardProps {
  label: string
  value: number | string
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</span>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  )
}
