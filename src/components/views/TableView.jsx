import { useState } from 'react'
import BucketTag from '../shared/BucketTag'
import PriorityBadge from '../shared/PriorityBadge'
import StatusChip from '../shared/StatusChip'
import { formatDate, isOverdue, daysUntil } from '../../utils/dateHelpers'
import { BUCKETS, PRIORITIES, STATUSES, STATUS_LABELS } from '../../constants/enums'

const COLS = [
  { key: 'name', label: 'Project' },
  { key: 'bucket', label: 'Bucket' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'startDate', label: 'Start' },
  { key: 'endDate', label: 'End' },
]

const PRIORITY_ORDER = { High: 0, 'Medium-High': 1, Medium: 2, Low: 3 }

export default function TableView({ projects, onEdit }) {
  const [search, setSearch] = useState('')
  const [bucketF, setBucketF] = useState('')
  const [priorityF, setPriorityF] = useState('')
  const [statusF, setStatusF] = useState('')
  const [sort, setSort] = useState({ col: 'priority', dir: 'asc' })

  function toggleSort(col) {
    setSort(s => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' })
  }

  const filtered = projects.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (bucketF && p.bucket !== bucketF) return false
    if (priorityF && p.priority !== priorityF) return false
    if (statusF !== '' && statusF !== '__all__' && p.status !== statusF) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sort.col] ?? ''
    let vb = b[sort.col] ?? ''
    if (sort.col === 'priority') {
      va = PRIORITY_ORDER[a.priority] ?? 99
      vb = PRIORITY_ORDER[b.priority] ?? 99
      return sort.dir === 'asc' ? va - vb : vb - va
    }
    return sort.dir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
  })

  function SortIcon({ col }) {
    if (sort.col !== col) return <span className="text-slate-300 ml-1">↕</span>
    return <span className="text-indigo-500 ml-1">{sort.dir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="p-6">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56"
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={bucketF}
          onChange={e => setBucketF(e.target.value)}
        >
          <option value="">All buckets</option>
          {BUCKETS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={priorityF}
          onChange={e => setPriorityF(e.target.value)}
        >
          <option value="">All priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={statusF}
          onChange={e => setStatusF(e.target.value)}
        >
          <option value="__all__">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <span className="text-sm text-slate-400 self-center ml-auto">{sorted.length} project{sorted.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {COLS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-slate-700"
                  >
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400">
                    No projects match your filters.
                  </td>
                </tr>
              )}
              {sorted.map(p => {
                const overdue = isOverdue(p)
                const days = daysUntil(p.endDate)
                return (
                  <tr
                    key={p.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {overdue && <span title="Overdue" className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                        <span className="font-medium text-slate-900">{p.name}</span>
                      </div>
                      {p.notes && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{p.notes}</p>}
                    </td>
                    <td className="px-4 py-3"><BucketTag bucket={p.bucket} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={p.priority} /></td>
                    <td className="px-4 py-3"><StatusChip status={p.status} /></td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(p.startDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={overdue ? 'text-red-600 font-medium' : days !== null && days <= 30 ? 'text-orange-600 font-medium' : 'text-slate-500'}>
                        {formatDate(p.endDate)}
                        {overdue && <span className="ml-1 text-xs">(overdue)</span>}
                        {!overdue && days !== null && days <= 30 && <span className="ml-1 text-xs">({days}d)</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onEdit(p)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-all text-xs font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
