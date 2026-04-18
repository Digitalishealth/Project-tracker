import { STATUS_COLORS, STATUS_LABELS } from '../../constants/enums'

export default function StatusChip({ status }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS['']
  const label = STATUS_LABELS[status] ?? 'Backlog'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {label}
    </span>
  )
}
