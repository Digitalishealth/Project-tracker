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

const IconCalendar = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
    <path fillRule="evenodd" d="M4.75 1a.75.75 0 0 1 .75.75V3h5V1.75a.75.75 0 0 1 1.5 0V3h.25A2.75 2.75 0 0 1 15 5.75v7.5A2.75 2.75 0 0 1 12.25 16H3.75A2.75 2.75 0 0 1 1 13.25v-7.5A2.75 2.75 0 0 1 3.75 3H4V1.75A.75.75 0 0 1 4.75 1Zm-1 3.5A1.25 1.25 0 0 0 2.5 5.75V6.5h11V5.75A1.25 1.25 0 0 0 12.25 4.5H3.75ZM2.5 8v5.25c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25V8h-11Z" clipRule="evenodd" />
  </svg>
)
const IconDownload = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
    <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
    <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
  </svg>
)
const IconUpload = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
    <path d="M8.75 13.25a.75.75 0 0 1-1.5 0V7.56L5.03 9.78a.75.75 0 0 1-1.06-1.06l3.5-3.5a.75.75 0 0 1 1.06 0l3.5 3.5a.75.75 0 1 1-1.06 1.06L8.75 7.56v5.69Z" />
    <path d="M3.5 3.75a.75.75 0 0 1 1.5 0v-.5c0-.69.56-1.25 1.25-1.25h6.5c.69 0 1.25.56 1.25 1.25v.5a.75.75 0 0 1 1.5 0v-.5A2.75 2.75 0 0 0 12.25 1h-6.5A2.75 2.75 0 0 0 3 3.25v.5Z" />
  </svg>
)
const IconSpreadsheet = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
    <path fillRule="evenodd" d="M2 3.75A1.75 1.75 0 0 1 3.75 2h8.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5Zm6 .75v3h3.5v-3H8Zm0 4.5v3h3.5v-3H8Zm-1.5 3v-3h-3v3h3Zm0-4.5v-3h-3v3h3Z" clipRule="evenodd" />
  </svg>
)
const IconPlus = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 flex-shrink-0">
    <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
  </svg>
)

export default function TopBar({ activeView, projects, onAdd, onImport }) {
  const fileRef = useRef()

  function handleExportJSON() { exportJSON(projects); toast.success('Backup downloaded') }
  function handleExportCSV() { exportCSV(projects); toast.success('CSV downloaded') }
  function handleExportICS() { exportICS(projects); toast.success('Calendar file downloaded') }

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
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-sm font-semibold text-slate-700 tracking-tight">{VIEW_TITLES[activeView]}</h1>

      <div className="flex items-center gap-2">
        {/* Secondary actions — grouped */}
        <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1">
          <button onClick={handleExportICS} title="Export calendar (.ics)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-colors duration-150 ease-out">
            <IconCalendar /> Calendar
          </button>
          <button onClick={handleExportCSV} title="Export as CSV"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-colors duration-150 ease-out">
            <IconSpreadsheet /> CSV
          </button>
          <button onClick={() => fileRef.current?.click()} title="Import backup"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-colors duration-150 ease-out">
            <IconUpload /> Import
          </button>
          <button onClick={handleExportJSON} title="Download JSON backup"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-colors duration-150 ease-out">
            <IconDownload /> Backup
          </button>
        </div>

        {/* Primary CTA — one per area */}
        <button onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-colors duration-150 ease-out">
          <IconPlus /> New Project
        </button>

        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
      </div>
    </header>
  )
}
