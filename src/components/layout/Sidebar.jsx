import { BUCKETS, BUCKET_COLORS } from '../../constants/enums'

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-3a1 1 0 0 0-1 1v2a1 1 0 0 0 .553.894l2 1a1 1 0 0 0 .894-1.789L11 9.382V8a1 1 0 0 0-1-1Z" />
      </svg>
    ),
  },
  {
    id: 'table',
    label: 'Table',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19.01 5.24l.004 9.5A2.25 2.25 0 0 1 16.76 17H3.25A2.25 2.25 0 0 1 1 14.75l-.01-9.51Zm8.26 9.52v-.625a.75.75 0 0 0-1.5 0v.625H3.25a.75.75 0 0 1-.75-.75L2.49 6h15.02l.01 7.75a.75.75 0 0 1-.75.75H9.25Zm1.5 0h3.75a.75.75 0 0 0 .75-.75V8.5H9.25v5.5a.75.75 0 0 0 .75.75h-.25Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'kanban',
    label: 'Board',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h11A1.5 1.5 0 0 1 17 3.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13ZM6.5 4a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-2Zm5 0a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-2Z" />
      </svg>
    ),
  },
  {
    id: 'gantt',
    label: 'Timeline',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 6 10Zm-2.25 5.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5ZM2 4.75A.75.75 0 0 1 2.75 4H4a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5.25a.75.75 0 0 1 .75-.75H4a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export default function Sidebar({ activeView, onViewChange, bucketFilter, onBucketFilter }) {
  function toggleBucket(b) {
    onBucketFilter(
      bucketFilter.includes(b) ? bucketFilter.filter(x => x !== b) : [...bucketFilter, b]
    )
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
              <path d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v2.5A2.25 2.25 0 0 1 15.75 9H4.25A2.25 2.25 0 0 1 2 6.75v-2.5Zm0 9A2.25 2.25 0 0 1 4.25 11h4.5A2.25 2.25 0 0 1 11 13.25v2.5A2.25 2.25 0 0 1 8.75 18h-4.5A2.25 2.25 0 0 1 2 15.75v-2.5Zm9 0A2.25 2.25 0 0 1 13.25 11h2.5A2.25 2.25 0 0 1 18 13.25v2.5A2.25 2.25 0 0 1 15.75 18h-2.5A2.25 2.25 0 0 1 11 15.75v-2.5Z" />
            </svg>
          </div>
          <span className="font-semibold text-slate-800 text-sm tracking-tight">Project Tracker</span>
        </div>
      </div>

      <nav className="p-3 flex-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1.5 mt-1">Views</p>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5 ${
              activeView === item.id
                ? 'bg-indigo-50 text-indigo-700 shadow-[inset_2px_0_0_0_#4f46e5]'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className={activeView === item.id ? 'text-indigo-600' : 'text-slate-400'}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-1.5">Bucket</p>
          <button
            onClick={() => onBucketFilter([])}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all mb-0.5 ${
              bucketFilter.length === 0
                ? 'bg-slate-100 text-slate-700 font-medium'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0" />
            All
          </button>
          {BUCKETS.map(b => {
            const colors = BUCKET_COLORS[b]
            const active = bucketFilter.includes(b)
            return (
              <button
                key={b}
                onClick={() => toggleBucket(b)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all mb-0.5 ${
                  active
                    ? `${colors.bg} ${colors.text} font-medium`
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                <span className="truncate">{b}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
