import { STATUS_COLORS, STATUS_LABELS } from '../../constants/enums'

export default function StatusChip({ status }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS['']
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {STATUS_LABELS[status] ?? 'Backlog'}
    </span>
  )
}
