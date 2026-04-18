import { useRef } from 'react'
import { exportJSON, exportCSV, parseImportedJSON } from '../../utils/storage'
import { exportICS } from '../../utils/icsExport'
import toast from 'react-hot-toast'

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  table: 'All Projects',
  kanban: 'Board',
  gantt: 'Timeline',
}

export default function TopBar({ activeView, projects, onAdd, onImport }) {
  const fileRef = useRef()

  function handleExportJSON() { exportJSON(projects); toast.success('Backup exported') }
  function handleExportCSV() { exportCSV(projects); toast.success('CSV exported') }
  function handleExportICS() { exportICS(projects); toast.success('Calendar file exported') }

  function handleImportFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const imported = parseImportedJSON(evt.target.result)
        onImport(imported)
        toast.success(`Imported ${imported.length} projects`)
      } catch {
        toast.error('Invalid backup file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-base font-semibold text-slate-900">{VIEW_TITLES[activeView]}</h1>
      <div className="flex items-center gap-2">
        <button onClick={handleExportICS} title="Export to calendar (.ics)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          📅 Calendar
        </button>
        <button onClick={handleExportCSV} title="Export as CSV for Excel/Google Sheets"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          ⬇ CSV
        </button>
        <button onClick={() => fileRef.current?.click()} title="Import backup JSON"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          ↑ Import
        </button>
        <button onClick={handleExportJSON} title="Export backup JSON"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          ↓ Backup
        </button>
        <button onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          + New Project
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
      </div>
    </header>
  )
}
