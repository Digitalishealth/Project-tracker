import { STATUS_COLORS, STATUS_LABELS, STATUSES } from '../../constants/enums'

export default function StatusSelect({ status, onChange }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS['']
  return (
    <select
      value={status}
      onClick={e => e.stopPropagation()}
      onChange={e => { e.stopPropagation(); onChange(e.target.value) }}
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border cursor-pointer outline-none ${c.bg} ${c.text} ${c.border}`}
      style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', backgroundImage: 'none' }}
    >
      {STATUSES.map(s => (
        <option key={s} value={s} style={{ background: 'white', color: '#1e293b' }}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  )
}
