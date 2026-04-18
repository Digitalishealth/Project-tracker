import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Dashboard from '../views/Dashboard'
import TableView from '../views/TableView'
import KanbanView from '../views/KanbanView'
import GanttView from '../views/GanttView'
import ProjectModal from '../modals/ProjectModal'
import { useProjects } from '../../hooks/useProjects'

export default function AppShell() {
  const { projects, addProject, updateProject, deleteProject, importProjects } = useProjects()
  const [activeView, setActiveView] = useState('dashboard')
  const [bucketFilter, setBucketFilter] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const filtered = bucketFilter.length > 0
    ? projects.filter(p => bucketFilter.includes(p.bucket))
    : projects

  function openAdd() {
    setEditingProject(null)
    setModalOpen(true)
  }

  function openEdit(project) {
    setEditingProject(project)
    setModalOpen(true)
  }

  function handleSave(data) {
    if (editingProject) {
      updateProject(editingProject.id, data)
    } else {
      addProject(data)
    }
  }

  function handleDelete(id) {
    deleteProject(id)
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        bucketFilter={bucketFilter}
        onBucketFilter={setBucketFilter}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          activeView={activeView}
          projects={projects}
          onAdd={openAdd}
          onImport={importProjects}
        />
        <main className="flex-1 overflow-auto">
          {activeView === 'dashboard' && (
            <Dashboard projects={filtered} allProjects={projects} onEdit={openEdit} onAdd={openAdd} />
          )}
          {activeView === 'table' && (
            <TableView projects={filtered} onEdit={openEdit} />
          )}
          {activeView === 'kanban' && (
            <KanbanView projects={filtered} onEdit={openEdit} onStatusChange={updateProject} />
          )}
          {activeView === 'gantt' && (
            <GanttView projects={filtered} onEdit={openEdit} />
          )}
        </main>
      </div>
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        project={editingProject}
      />
      <Toaster position="bottom-right" toastOptions={{ style: { fontSize: '13px' } }} />
    </div>
  )
}
