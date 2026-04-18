import { PRIORITY_COLORS } from '../../constants/enums'

export default function PriorityBadge({ priority }) {
  const colors = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Low
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      {priority || 'Low'}
    </span>
  )
}
