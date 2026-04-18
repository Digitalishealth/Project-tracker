import { BUCKET_COLORS } from '../../constants/enums'

export default function BucketTag({ bucket }) {
  const colors = BUCKET_COLORS[bucket] || { bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
      {bucket || '—'}
    </span>
  )
}
