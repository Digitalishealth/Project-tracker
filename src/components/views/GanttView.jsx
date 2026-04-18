import { useMemo } from 'react'
import { format } from 'date-fns'
import { getGanttRange, getMonthColumns, ganttBarStyle } from '../../utils/dateHelpers'
import { BUCKET_COLORS, PRIORITIES } from '../../constants/enums'

const MONTH_WIDTH = 120 // px per month

export default function GanttView({ projects, onEdit }) {
  const { start, end } = useMemo(() => getGanttRange(projects), [projects])
  const months = useMemo(() => getMonthColumns(start, end), [start, end])
  const totalMs = end - start

  const grouped = useMemo(() => {
    return PRIORITIES.map(priority => ({
      priority,
      items: projects.filter(p => p.priority === priority),
    })).filter(g => g.items.length > 0)
  }, [projects])

  const totalWidth = months.length * MONTH_WIDTH

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-w-max">
        {/* Month header */}
        <div className="flex border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
          <div className="w-56 flex-shrink-0 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-100">
            Project
          </div>
          <div className="flex" style={{ width: totalWidth }}>
            {months.map((m, i) => (
              <div
                key={i}
                style={{ width: MONTH_WIDTH }}
                className="flex-shrink-0 px-3 py-3 text-xs font-medium text-slate-500 border-r border-slate-100 last:border-r-0"
              >
                {format(m, 'MMM yyyy')}
              </div>
            ))}
          </div>
        </div>

        {/* Today line and rows */}
        <div className="relative">
          {grouped.map(({ priority, items }) => (
            <div key={priority}>
              {/* Priority group header */}
              <div className="flex border-b border-slate-50 bg-slate-50/70">
                <div className="w-56 flex-shrink-0 px-4 py-2 text-xs font-semibold text-slate-500 border-r border-slate-100">
                  {priority}
                </div>
                <div style={{ width: totalWidth }} className="relative h-8">
                  {/* Month grid lines */}
                  {months.map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-r border-slate-100"
                      style={{ left: (i + 1) * MONTH_WIDTH }}
                    />
                  ))}
                </div>
              </div>

              {/* Project rows */}
              {items.map(p => {
                const bar = ganttBarStyle(p, start, totalMs)
                const colors = BUCKET_COLORS[p.bucket] || {}
                return (
                  <div
                    key={p.id}
                    className="flex border-b border-slate-50 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-56 flex-shrink-0 px-4 py-2.5 border-r border-slate-100">
                      <p
                        onClick={() => onEdit(p)}
                        className="text-sm font-medium text-slate-800 truncate cursor-pointer hover:text-indigo-600 transition-colors"
                        title={p.name}
                      >
                        {p.name}
                      </p>
                    </div>
                    <div className="relative flex-shrink-0 flex items-center" style={{ width: totalWidth, height: 40 }}>
                      {/* Grid lines */}
                      {months.map((_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 border-r border-slate-100"
                          style={{ left: (i + 1) * MONTH_WIDTH }}
                        />
                      ))}
                      {/* Gantt bar */}
                      {bar ? (
                        <div
                          className="absolute h-6 rounded-full cursor-pointer transition-opacity hover:opacity-80 group/bar"
                          style={{
                            left: bar.left,
                            width: bar.width,
                            backgroundColor: colors.bar || '#94a3b8',
                          }}
                          onClick={() => onEdit(p)}
                          title={`${p.name}\n${p.startDate} → ${p.endDate}`}
                        >
                          <span className="px-2 text-xs font-medium text-white leading-6 block truncate">
                            {p.name}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="absolute left-2 text-xs text-slate-300 italic cursor-pointer"
                          onClick={() => onEdit(p)}
                        >
                          No dates set
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}

          {projects.length === 0 && (
            <div className="flex">
              <div className="w-56 flex-shrink-0 border-r border-slate-100" />
              <div className="flex-1 py-16 text-center text-slate-400 text-sm">No projects to display.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
