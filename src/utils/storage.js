import { SEED_PROJECTS } from '../data/seedData'

const KEY = 'pt_projects'

function migrateProject(p) {
  return {
    ...p,
    progress: p.progress ?? 0,
  }
}

export function loadProjects() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed.map(migrateProject)
  } catch {
    return null
  }
}

export function saveProjects(projects) {
  try {
    localStorage.setItem(KEY, JSON.stringify(projects))
  } catch (e) {
    console.error('Failed to save projects', e)
  }
}

export function initProjects() {
  const existing = loadProjects()
  if (existing && existing.length > 0) return existing
  saveProjects(SEED_PROJECTS)
  return SEED_PROJECTS
}

export function exportJSON(projects) {
  const date = new Date().toISOString().slice(0, 10)
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `project-tracker-backup-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportCSV(projects) {
  const headers = ['Name', 'Bucket', 'Priority', 'Status', 'Progress (%)', 'Start Date', 'End Date', 'Notes']
  const rows = projects.map(p => [
    `"${(p.name || '').replace(/"/g, '""')}"`,
    `"${p.bucket || ''}"`,
    `"${p.priority || ''}"`,
    `"${p.status || 'Backlog'}"`,
    p.progress ?? 0,
    p.startDate || '',
    p.endDate || '',
    `"${(p.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
  ])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const date = new Date().toISOString().slice(0, 10)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `projects-${date}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImportedJSON(text) {
  const data = JSON.parse(text)
  if (!Array.isArray(data)) throw new Error('Expected an array of projects')
  return data.map(p => migrateProject({
    id: p.id || crypto.randomUUID(),
    name: p.name || 'Untitled',
    bucket: p.bucket || '',
    priority: p.priority || 'Low',
    startDate: p.startDate || '',
    endDate: p.endDate || '',
    status: p.status || '',
    notes: p.notes || '',
  }))
}
