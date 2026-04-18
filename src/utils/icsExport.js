import { parseISO, format } from 'date-fns'

function toICSDate(dateStr) {
  return format(parseISO(dateStr), 'yyyyMMdd')
}

export function exportICS(projects) {
  const withDates = projects.filter(p => p.startDate && p.endDate)
  if (withDates.length === 0) return

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Project Tracker//EN',
    'CALSCALE:GREGORIAN',
  ]

  withDates.forEach(p => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${p.id}@project-tracker`,
      `SUMMARY:${p.name}`,
      `DTSTART;VALUE=DATE:${toICSDate(p.startDate)}`,
      `DTEND;VALUE=DATE:${toICSDate(p.endDate)}`,
      `DESCRIPTION:Bucket: ${p.bucket}\\nPriority: ${p.priority}\\nStatus: ${p.status || 'Backlog'}${p.notes ? '\\n' + p.notes : ''}`,
      'BEGIN:VALARM',
      'TRIGGER:-P7D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Due soon: ${p.name}`,
      'END:VALARM',
      'END:VEVENT',
    )
  })

  lines.push('END:VCALENDAR')
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'projects.ics'
  a.click()
  URL.revokeObjectURL(url)
}
