import { STATUS_COLORS, STATUS_LABELS, STATUSES } from '../../constants/enums'

/**
 * Inline status selector styled as a chip.
 * Renders a <select> visually matching StatusChip.
 * Stops propagation so it doesn't trigger row click handlers.
 */
export default function StatusSelect({ status, onChange }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS['']
  return (
    <select
      value={status}
      onClick={e => e.stopPropagation()}
      onChange={e => { e.stopPropagation(); onChange(e.target.value) }}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border-0 outline-none cursor-pointer appearance-none pr-4 ${colors.bg} ${colors.text}`}
      style={{ backgroundImage: 'none' }}
    >
      {STATUSES.map(s => (
        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
      ))}
    </select>
  )
}
