import { SEED_PROJECTS } from '../data/seedData'

const KEY = 'pt_projects'

export function loadProjects() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
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

export function parseImportedJSON(text) {
  const data = JSON.parse(text)
  if (!Array.isArray(data)) throw new Error('Expected an array of projects')
  return data.map(p => ({
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
