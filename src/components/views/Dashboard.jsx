import { useMemo } from 'react'
import BucketTag from '../shared/BucketTag'
import PriorityBadge from '../shared/PriorityBadge'
import StatusSelect from '../shared/StatusSelect'
import { isOverdue, isDueSoon, daysUntil, daysOverdue, formatDate } from '../../utils/dateHelpers'
import { BUCKET_COLORS } from '../../constants/enums'

function StatCard({ label, value, dotColor = 'bg-slate-300', accent }) {
  return (
    <div className={`bg-white rounded-lg border px-4 py-4 flex items-center gap-3 ${accent && value > 0 ? 'border-red-200 bg-red-50/40' : 'border-slate-100'}`}>
      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`} />
      <div className="min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className={`text-2xl font-bold leading-none ${accent && value > 0 ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
      </div>
    </div>
  )
}

function ProjectRow({ project, onEdit, onStatusChange, right }) {
  return (
    <li
      className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 ease-out group"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={() => onEdit(project)}>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{project.name}</p>
          {project.notes && <p className="text-xs text-slate-400 truncate">{project.notes}</p>}
        </div>
        <BucketTag bucket={project.bucket} />
      </div>
      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
        {right}
        <StatusSelect status={project.status} onChange={val => onStatusChange(project.id, { status: val })} />
      </div>
    </li>
  )
}

export default function Dashboard({ projects, allProjects, onEdit, onAdd, onStatusChange }) {
  const active = allProjects.filter(p => p.status === 'Active')
  const upcoming = allProjects.filter(p => p.status === 'Upcoming')
  const background = allProjects.filter(p => p.status === 'Background')
  const backlog = allProjects.filter(p => p.status === '')
  const complete = allProjects.filter(p => p.status === 'Complete')
  const unscheduled = allProjects.filter(p => !p.startDate && !p.endDate && p.status !== 'Complete')

  const overdueProjects = useMemo(
    () => allProjects.filter(p => isOverdue(p) && p.status !== 'Complete').sort((a, b) => a.endDate.localeCompare(b.endDate)),
    [allProjects]
  )
  const dueSoonProjects = useMemo(
    () => allProjects.filter(p => isDueSoon(p, 30) && !isOverdue(p) && p.status !== 'Complete').sort((a, b) => a.endDate.localeCompare(b.endDate)),
    [allProjects]
  )

  const bucketBreakdown = useMemo(() => {
    const map = {}
    allProjects.filter(p => p.status !== 'Complete').forEach(p => {
      map[p.bucket] = (map[p.bucket] || 0) + 1
    })
    const total = allProjects.filter(p => p.status !== 'Complete').length || 1
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([b, c]) => [b, c, total])
  }, [allProjects])

  function Section({ title, items, badge, badgeColor = 'bg-slate-100 text-slate-500', dot, emptyMsg, renderRight }) {
    return (
      <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {dot && <span className={`w-2 h-2 rounded-full ${dot}`} />}
            <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>{badge ?? items.length}</span>
        </div>
        {items.length === 0
          ? <p className="text-sm text-slate-400 px-5 py-5 text-center">{emptyMsg || 'None'}</p>
          : (
            <ul className="divide-y divide-slate-50">
              {items.map(p => (
                <ProjectRow
                  key={p.id}
                  project={p}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                  right={renderRight ? renderRight(p) : <PriorityBadge priority={p.priority} />}
                />
              ))}
            </ul>
          )
        }
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Overdue alert */}
      {overdueProjects.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="text-red-500 font-bold">!</span>
          <p className="text-sm font-medium text-red-700">
            {overdueProjects.length} project{overdueProjects.length !== 1 ? 's are' : ' is'} overdue — update the status or extend the deadline.
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Active" value={active.length} dotColor="bg-green-400" />
        <StatCard label="Upcoming" value={upcoming.length} dotColor="bg-sky-400" />
        <StatCard label="Background" value={background.length} dotColor="bg-slate-400" />
        <StatCard label="Due ≤ 30 days" value={dueSoonProjects.length} dotColor="bg-orange-400" />
        <StatCard label="Overdue" value={overdueProjects.length} dotColor="bg-red-400" accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {overdueProjects.length > 0 && (
            <Section
              title="Overdue"
              items={overdueProjects}
              badgeColor="bg-red-50 text-red-600"
              dot="bg-red-500"
              renderRight={p => (
                <span className="text-xs text-red-600 font-medium whitespace-nowrap">{daysOverdue(p.endDate)}d overdue</span>
              )}
            />
          )}
          {dueSoonProjects.length > 0 && (
            <Section
              title="Due in 30 Days"
              items={dueSoonProjects}
              badgeColor="bg-orange-50 text-orange-600"
              dot="bg-orange-400"
              renderRight={p => (
                <span className="text-xs text-orange-600 font-medium whitespace-nowrap">{daysUntil(p.endDate)}d left</span>
              )}
            />
          )}
          <Section
            title="Active"
            items={active}
            badgeColor="bg-green-50 text-green-700"
            dot="bg-green-500"
            emptyMsg="No active projects. Mark a project as Active to see it here."
          />
          <Section
            title="Upcoming"
            items={upcoming}
            badgeColor="bg-sky-50 text-sky-700"
            dot="bg-sky-500"
            emptyMsg="No upcoming projects."
          />
          {background.length > 0 && (
            <Section
              title="Background"
              items={background}
              badgeColor="bg-slate-100 text-slate-600"
              dot="bg-slate-400"
            />
          )}
          {backlog.length > 0 && (
            <Section
              title="Backlog"
              items={backlog}
              badgeColor="bg-gray-100 text-gray-500"
              dot="bg-gray-300"
            />
          )}
          {unscheduled.length > 0 && (
            <div className="bg-white rounded-lg border border-dashed border-slate-200">
              <div className="px-5 py-4 border-b border-dashed border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-500">Unscheduled</h2>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{unscheduled.length}</span>
              </div>
              <ul className="divide-y divide-slate-50">
                {unscheduled.map(p => (
                  <ProjectRow key={p.id} project={p} onEdit={onEdit} onStatusChange={onStatusChange}
                    right={<span className="text-xs text-slate-400 italic">No dates</span>}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Bucket breakdown */}
          <div className="bg-white rounded-lg border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-50">
              <h2 className="text-sm font-semibold text-slate-900">By Bucket</h2>
            </div>
            <ul className="p-5 space-y-3">
              {bucketBreakdown.map(([bucket, count, total]) => {
                const colors = BUCKET_COLORS[bucket] || {}
                const pct = Math.round((count / total) * 100)
                return (
                  <li key={bucket}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700">{bucket}</span>
                      <span className="text-xs text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: colors.bar || '#94a3b8' }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Complete */}
          {complete.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-100">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Completed</h2>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{complete.length}</span>
              </div>
              <ul className="divide-y divide-slate-50 max-h-48 overflow-y-auto">
                {complete.map(p => (
                  <li
                    key={p.id}
                    onClick={() => onEdit(p)}
                    className="px-5 py-2.5 flex items-center gap-2 hover:bg-slate-50 cursor-pointer transition-colors duration-150 ease-out"
                  >
                    <span className="text-emerald-500 text-sm">✓</span>
                    <span className="text-sm text-slate-500 line-through truncate">{p.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:border-teal-300 hover:text-teal-500 transition-colors duration-150 ease-out"
          >
            + Add new project
          </button>
        </div>
      </div>
    </div>
  )
}
