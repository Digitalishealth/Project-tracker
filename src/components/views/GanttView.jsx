import { useMemo, useEffect, useRef } from 'react'
import { format, isAfter, isBefore } from 'date-fns'
import { getGanttRange, getMonthColumns, ganttBarStyle } from '../../utils/dateHelpers'
import { BUCKET_COLORS, PRIORITIES } from '../../constants/enums'

const MONTH_WIDTH = 120

export default function GanttView({ projects, onEdit }) {
  const scrollRef = useRef(null)

  const visibleProjects = projects.filter(p => p.status !== 'Complete')

  const { start, end } = useMemo(() => getGanttRange(visibleProjects), [visibleProjects])
  const months = useMemo(() => getMonthColumns(start, end), [start, end])
  const totalMs = end - start
  const totalWidth = months.length * MONTH_WIDTH

  const today = new Date()
  const todayPct = Math.min(100, Math.max(0, ((today - start) / totalMs) * 100))
  const todayVisible = isAfter(today, start) && isBefore(today, end)

  // Scroll so today is centred in the viewport on mount
  useEffect(() => {
    if (!scrollRef.current || !todayVisible) return
    const todayPx = (todayPct / 100) * totalWidth
    const nameColWidth = 224 // w-56
    const viewportWidth = scrollRef.current.clientWidth - nameColWidth
    scrollRef.current.scrollLeft = todayPx - viewportWidth / 2
  }, [totalWidth, todayPct, todayVisible])

  const grouped = useMemo(() => {
    return PRIORITIES.map(priority => ({
      priority,
      items: visibleProjects.filter(p => p.priority === priority),
    })).filter(g => g.items.length > 0)
  }, [visibleProjects])

  const unscheduled = visibleProjects.filter(p => !p.startDate || !p.endDate)

  return (
    <div className="p-6 h-full flex flex-col">
      <div ref={scrollRef} className="bg-white rounded-lg border border-slate-100 overflow-auto flex-1">
        <div style={{ minWidth: totalWidth + 224 }}>
          {/* Month header */}
          <div className="flex border-b border-slate-100 bg-slate-50 sticky top-0 z-20">
            <div className="w-56 flex-shrink-0 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-100">
              Project
            </div>
            <div className="flex relative" style={{ width: totalWidth }}>
              {months.map((m, i) => (
                <div
                  key={i}
                  style={{ width: MONTH_WIDTH }}
                  className="flex-shrink-0 px-3 py-3 text-xs font-medium text-slate-500 border-r border-slate-100 last:border-r-0"
                >
                  {format(m, 'MMM yyyy')}
                </div>
              ))}
              {/* Today label in header */}
              {todayVisible && (
                <div
                  className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none"
                  style={{ left: `${todayPct}%` }}
                >
                  <span className="text-xs font-semibold text-red-500 bg-white px-1 rounded mt-1 leading-none">Today</span>
                </div>
              )}
            </div>
          </div>

          {/* Rows */}
          <div className="relative">
            {/* Today vertical line spanning all rows */}
            {todayVisible && (
              <div
                className="absolute top-0 bottom-0 z-10 pointer-events-none"
                style={{ left: `calc(224px + ${todayPct}%)` }}
              >
                <div className="h-full w-0.5 bg-red-400 opacity-70" />
              </div>
            )}

            {grouped.map(({ priority, items }) => (
              <div key={priority}>
                <div className="flex border-b border-slate-50 bg-slate-50/70">
                  <div className="w-56 flex-shrink-0 px-4 py-2 text-xs font-semibold text-slate-500 border-r border-slate-100">
                    {priority}
                  </div>
                  <div style={{ width: totalWidth }} className="relative h-8">
                    {months.map((_, i) => (
                      <div key={i} className="absolute top-0 bottom-0 border-r border-slate-100" style={{ left: (i + 1) * MONTH_WIDTH }} />
                    ))}
                  </div>
                </div>

                {items.map(p => {
                  const bar = ganttBarStyle(p, start, totalMs)
                  const colors = BUCKET_COLORS[p.bucket] || {}
                  const progress = p.progress ?? 0
                  return (
                    <div key={p.id} className="flex border-b border-slate-50 hover:bg-slate-50 transition-colors duration-150 ease-out">
                      <div className="w-56 flex-shrink-0 px-4 py-2.5 border-r border-slate-100">
                        <p
                          onClick={() => onEdit(p)}
                          className="text-sm font-medium text-slate-800 truncate cursor-pointer hover:text-teal-600 transition-colors duration-150 ease-out"
                          title={p.name}
                        >
                          {p.name}
                        </p>
                        {progress > 0 && (
                          <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden w-full">
                            <div className="h-full rounded-full bg-teal-500" style={{ width: `${progress}%` }} />
                          </div>
                        )}
                      </div>
                      <div className="relative flex-shrink-0 flex items-center" style={{ width: totalWidth, height: 44 }}>
                        {months.map((_, i) => (
                          <div key={i} className="absolute top-0 bottom-0 border-r border-slate-100" style={{ left: (i + 1) * MONTH_WIDTH }} />
                        ))}
                        {bar ? (
                          <div
                            className="absolute h-6 rounded-full cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                            style={{ left: bar.left, width: bar.width, backgroundColor: colors.bar || '#94a3b8' }}
                            onClick={() => onEdit(p)}
                            title={`${p.name} · ${p.startDate} → ${p.endDate}${progress ? ` · ${progress}% done` : ''}`}
                          >
                            {/* Progress overlay */}
                            {progress > 0 && (
                              <div
                                className="absolute left-0 top-0 bottom-0 rounded-full opacity-40 bg-white"
                                style={{ width: `${progress}%` }}
                              />
                            )}
                            <span className="relative px-2 text-xs font-medium text-white leading-6 block truncate">
                              {p.name}{progress > 0 ? ` · ${progress}%` : ''}
                            </span>
                          </div>
                        ) : (
                          <div className="absolute left-2 text-xs text-slate-300 italic cursor-pointer" onClick={() => onEdit(p)}>
                            No dates — click to set
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}

            {visibleProjects.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-16">No projects to display.</p>
            )}
          </div>
        </div>
      </div>

      {/* Unscheduled footer */}
      {unscheduled.length > 0 && (
        <div className="mt-3 bg-white rounded-lg border border-slate-100 px-4 py-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Unscheduled ({unscheduled.length})</p>
          <div className="flex flex-wrap gap-2">
            {unscheduled.map(p => (
              <button
                key={p.id}
                onClick={() => onEdit(p)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 hover:border-teal-300 hover:text-teal-600 transition-colors duration-150 ease-out"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
