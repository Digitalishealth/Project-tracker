import { parseISO, differenceInDays, isAfter, isBefore, startOfMonth, endOfMonth, addMonths, format } from 'date-fns'

export function isOverdue(project) {
  if (!project.endDate) return false
  return isBefore(parseISO(project.endDate), new Date())
}

export function isDueSoon(project, days = 30) {
  if (!project.endDate) return false
  const end = parseISO(project.endDate)
  const today = new Date()
  return !isBefore(end, today) && differenceInDays(end, today) <= days
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  return differenceInDays(parseISO(dateStr), new Date())
}

export function daysOverdue(dateStr) {
  if (!dateStr) return null
  return differenceInDays(new Date(), parseISO(dateStr))
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return format(parseISO(dateStr), 'd MMM yyyy')
}

export function getGanttRange(projects) {
  const withDates = projects.filter(p => p.startDate && p.endDate)
  if (withDates.length === 0) {
    const now = new Date()
    return { start: startOfMonth(now), end: endOfMonth(addMonths(now, 6)) }
  }
  const starts = withDates.map(p => parseISO(p.startDate))
  const ends = withDates.map(p => parseISO(p.endDate))
  const minDate = starts.reduce((a, b) => (isBefore(a, b) ? a : b))
  const maxDate = ends.reduce((a, b) => (isAfter(a, b) ? a : b))
  return {
    start: startOfMonth(minDate),
    end: endOfMonth(maxDate),
  }
}

export function getMonthColumns(start, end) {
  const months = []
  let current = startOfMonth(start)
  while (!isAfter(current, end)) {
    months.push(current)
    current = addMonths(current, 1)
  }
  return months
}

export function ganttBarStyle(project, rangeStart, totalMs) {
  if (!project.startDate || !project.endDate) return null
  const start = parseISO(project.startDate)
  const end = parseISO(project.endDate)
  const leftMs = start - rangeStart
  const widthMs = end - start
  const left = Math.max(0, (leftMs / totalMs) * 100)
  const width = Math.max(0.5, (widthMs / totalMs) * 100)
  return { left: `${left}%`, width: `${width}%` }
}
