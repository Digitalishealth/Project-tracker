import { BUCKET_COLORS } from '../../constants/enums'

export default function BucketTag({ bucket }) {
  const c = BUCKET_COLORS[bucket] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {bucket || '—'}
    </span>
  )
}
