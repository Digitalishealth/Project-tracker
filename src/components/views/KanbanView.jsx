import { useMemo, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import BucketTag from '../shared/BucketTag'
import PriorityBadge from '../shared/PriorityBadge'
import { formatDate, isOverdue } from '../../utils/dateHelpers'
import { STATUS_LABELS } from '../../constants/enums'

const COLUMNS = [
  { id: 'Active', color: 'bg-green-500' },
  { id: 'Upcoming', color: 'bg-sky-500' },
  { id: 'Background', color: 'bg-slate-400' },
  { id: '', color: 'bg-gray-300' },
  { id: 'Complete', color: 'bg-emerald-500' },
]

function ProjectCard({ project, onEdit, isDragging }) {
  const overdue = isOverdue(project)
  const progress = project.progress ?? 0
  const isComplete = project.status === 'Complete'
  return (
    <div
      onClick={() => onEdit(project)}
      className={`bg-white rounded-lg border p-3 cursor-pointer hover:shadow-md transition-all select-none ${
        isDragging ? 'opacity-50' :
        isComplete ? 'border-emerald-100 opacity-70' :
        overdue ? 'border-red-200 hover:border-red-300' :
        'border-slate-100 hover:border-teal-200'
      }`}
    >
      <p className={`text-sm font-medium mb-2 ${isComplete ? 'line-through text-slate-400' : overdue ? 'text-red-700' : 'text-slate-900'}`}>
        {isComplete && <span className="text-emerald-500 mr-1 not-italic">✓</span>}{project.name}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        <BucketTag bucket={project.bucket} />
        <PriorityBadge priority={project.priority} />
      </div>
      {progress > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span><span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-teal-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {project.endDate && (
        <p className={`text-xs ${overdue && !isComplete ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
          {overdue && !isComplete ? '⚠ ' : ''}Due {formatDate(project.endDate)}
        </p>
      )}
    </div>
  )
}

function SortableCard({ project, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProjectCard project={project} onEdit={onEdit} isDragging={isDragging} />
    </div>
  )
}

export default function KanbanView({ projects, onEdit, onStatusChange }) {
  const [activeId, setActiveId] = useState(null)
  const [showComplete, setShowComplete] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const completeCount = useMemo(() => projects.filter(p => p.status === 'Complete').length, [projects])

  const visibleColumns = useMemo(() => {
    return COLUMNS.filter(col => col.id !== 'Complete' || showComplete).map(col => ({
      ...col,
      items: projects.filter(p => p.status === col.id),
    }))
  }, [projects, showComplete])

  const activeProject = useMemo(() => projects.find(p => p.id === activeId), [activeId, projects])

  function findColumn(id) {
    return COLUMNS.find(col => projects.filter(p => p.status === col.id).some(p => p.id === id))
  }

  function handleDragStart({ active }) { setActiveId(active.id) }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over) return
    const isColDrop = COLUMNS.some(c => c.id === over.id)
    if (isColDrop) { onStatusChange(active.id, { status: over.id }); return }
    const destCol = findColumn(over.id)
    const sourceCol = findColumn(active.id)
    if (destCol && sourceCol?.id !== destCol?.id) onStatusChange(active.id, { status: destCol.id })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-6 h-full flex flex-col">
        {/* Toggle completed */}
        {completeCount > 0 && (
          <div className="mb-4 flex">
            <button
              onClick={() => setShowComplete(v => !v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors duration-150 ease-out ${showComplete ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              {showComplete ? `Hide completed column (${completeCount})` : `Show completed column (${completeCount})`}
            </button>
          </div>
        )}
        <div className="overflow-x-auto flex-1">
          <div className="flex gap-4 min-w-max pb-4 h-full">
            {visibleColumns.map(col => (
              <div key={col.id} id={col.id} className="w-72 flex flex-col bg-slate-50/80 rounded-lg border border-slate-200/70">
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-t-lg border-b border-slate-100">
                  <span className={`w-2 h-2 rounded-full ${col.color}`} />
                  <h3 className="text-sm font-semibold text-slate-700">{STATUS_LABELS[col.id]}</h3>
                  <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
                    {col.items.length}
                  </span>
                </div>
                <SortableContext items={col.items.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="p-3 flex flex-col gap-2 flex-1 min-h-24">
                    {col.items.map(p => <SortableCard key={p.id} project={p} onEdit={onEdit} />)}
                    {col.items.length === 0 && (
                      <div className="flex-1 flex items-center justify-center text-xs text-slate-300 border-2 border-dashed border-slate-200 rounded-lg py-8">
                        Drop here
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeProject && <ProjectCard project={activeProject} onEdit={() => {}} />}
      </DragOverlay>
    </DndContext>
  )
}
