import { BUCKETS, BUCKET_COLORS } from '../../constants/enums'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'table', label: 'Table', icon: '≡' },
  { id: 'kanban', label: 'Board', icon: '⊞' },
  { id: 'gantt', label: 'Timeline', icon: '▬' },
]

export default function Sidebar({ activeView, onViewChange, bucketFilter, onBucketFilter }) {
  function toggleBucket(b) {
    if (bucketFilter.includes(b)) {
      onBucketFilter(bucketFilter.filter(x => x !== b))
    } else {
      onBucketFilter([...bucketFilter, b])
    }
  }

  const allSelected = bucketFilter.length === 0

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">PT</div>
          <span className="font-semibold text-slate-800 text-sm">Project Tracker</span>
        </div>
      </div>

      <nav className="p-3 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Views</p>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
              activeView === item.id
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Filter by Bucket</p>
          <button
            onClick={() => onBucketFilter([])}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors mb-0.5 ${
              allSelected ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            All buckets
          </button>
          {BUCKETS.map(b => {
            const colors = BUCKET_COLORS[b]
            const active = bucketFilter.includes(b)
            return (
              <button
                key={b}
                onClick={() => toggleBucket(b)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors mb-0.5 ${
                  active ? `${colors.bg} ${colors.text} font-medium` : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <span className="truncate">{b}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
