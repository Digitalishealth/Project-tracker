import { useMemo } from 'react'
import BucketTag from '../shared/BucketTag'
import PriorityBadge from '../shared/PriorityBadge'
import { isOverdue, isDueSoon, daysUntil, daysOverdue, formatDate } from '../../utils/dateHelpers'
import { BUCKET_COLORS } from '../../constants/enums'

function StatCard({ label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${color}`}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard({ projects, allProjects, onEdit, onAdd }) {
  const stats = useMemo(() => {
    const active = allProjects.filter(p => p.status === 'Active').length
    const upcoming = allProjects.filter(p => p.status === 'Upcoming').length
    const overdue = allProjects.filter(p => isOverdue(p)).length
    const dueSoon = allProjects.filter(p => isDueSoon(p, 30) && !isOverdue(p)).length
    return { total: allProjects.length, active, upcoming, overdue, dueSoon }
  }, [allProjects])

  const overdueProjects = useMemo(
    () => allProjects.filter(p => isOverdue(p)).sort((a, b) => a.endDate.localeCompare(b.endDate)),
    [allProjects]
  )

  const dueSoonProjects = useMemo(
    () => allProjects
      .filter(p => isDueSoon(p, 30) && !isOverdue(p))
      .sort((a, b) => a.endDate.localeCompare(b.endDate)),
    [allProjects]
  )

  const activeProjects = useMemo(
    () => allProjects.filter(p => p.status === 'Active'),
    [allProjects]
  )

  const bucketBreakdown = useMemo(() => {
    const map = {}
    allProjects.forEach(p => {
      map[p.bucket] = (map[p.bucket] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [allProjects])

  return (
    <div className="p-6 space-y-6">
      {/* Overdue alert */}
      {overdueProjects.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-red-500 text-lg">⚠</span>
          <p className="text-sm font-medium text-red-700">
            {overdueProjects.length} project{overdueProjects.length !== 1 ? 's are' : ' is'} overdue.
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={stats.total} />
        <StatCard label="Active" value={stats.active} sub="currently in progress" />
        <StatCard label="Due in 30 days" value={stats.dueSoon} sub="need attention soon" />
        <StatCard label="Overdue" value={stats.overdue} sub={stats.overdue > 0 ? 'action needed' : 'all on track'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active projects */}
        <div className="lg:col-span-2 space-y-4">
          {/* Overdue */}
          {overdueProjects.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Overdue</h2>
                <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">{overdueProjects.length}</span>
              </div>
              <ul className="divide-y divide-slate-50">
                {overdueProjects.map(p => (
                  <li
                    key={p.id}
                    onClick={() => onEdit(p)}
                    className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-800 truncate">{p.name}</span>
                      <BucketTag bucket={p.bucket} />
                    </div>
                    <span className="text-xs text-red-600 font-medium ml-3 whitespace-nowrap">
                      {daysOverdue(p.endDate)}d overdue
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Due soon */}
          {dueSoonProjects.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Due in 30 Days</h2>
                <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">{dueSoonProjects.length}</span>
              </div>
              <ul className="divide-y divide-slate-50">
                {dueSoonProjects.map(p => (
                  <li
                    key={p.id}
                    onClick={() => onEdit(p)}
                    className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-800 truncate">{p.name}</span>
                      <BucketTag bucket={p.bucket} />
                    </div>
                    <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                      <PriorityBadge priority={p.priority} />
                      <span className="text-xs text-orange-600 font-medium whitespace-nowrap">{daysUntil(p.endDate)}d left</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Active now */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Active Projects</h2>
              <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-full">{activeProjects.length}</span>
            </div>
            {activeProjects.length === 0 ? (
              <p className="text-sm text-slate-400 px-5 py-8 text-center">No active projects yet.</p>
            ) : (
              <ul className="divide-y divide-slate-50">
                {activeProjects.map(p => (
                  <li
                    key={p.id}
                    onClick={() => onEdit(p)}
                    className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                        {p.notes && <p className="text-xs text-slate-400 truncate">{p.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                      <BucketTag bucket={p.bucket} />
                      <PriorityBadge priority={p.priority} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right column: bucket breakdown */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-50">
              <h2 className="text-sm font-semibold text-slate-900">By Bucket</h2>
            </div>
            <ul className="p-5 space-y-3">
              {bucketBreakdown.map(([bucket, count]) => {
                const colors = BUCKET_COLORS[bucket] || {}
                const pct = Math.round((count / allProjects.length) * 100)
                return (
                  <li key={bucket}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{bucket}</span>
                      <span className="text-xs text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: colors.bar || '#94a3b8' }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <button
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
          >
            + Add new project
          </button>
        </div>
      </div>
    </div>
  )
}
