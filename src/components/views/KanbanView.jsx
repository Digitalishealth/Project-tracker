import { useMemo } from 'react'
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
import { useState } from 'react'
import BucketTag from '../shared/BucketTag'
import PriorityBadge from '../shared/PriorityBadge'
import { formatDate, isOverdue } from '../../utils/dateHelpers'
import { STATUS_LABELS } from '../../constants/enums'

const COLUMNS = [
  { id: 'Active', color: 'bg-green-500' },
  { id: 'Upcoming', color: 'bg-sky-500' },
  { id: 'Background', color: 'bg-slate-400' },
  { id: '', color: 'bg-gray-300' },
]

function ProjectCard({ project, onEdit, isDragging }) {
  const overdue = isOverdue(project)
  return (
    <div
      onClick={() => onEdit(project)}
      className={`bg-white rounded-xl border ${overdue ? 'border-red-200' : 'border-slate-100'} p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all select-none ${isDragging ? 'opacity-50' : ''}`}
    >
      <p className={`text-sm font-medium mb-2 ${overdue ? 'text-red-700' : 'text-slate-900'}`}>{project.name}</p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        <BucketTag bucket={project.bucket} />
        <PriorityBadge priority={project.priority} />
      </div>
      {project.endDate && (
        <p className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
          {overdue ? '⚠ ' : ''}Due {formatDate(project.endDate)}
        </p>
      )}
      {project.notes && (
        <p className="text-xs text-slate-400 mt-1 truncate">{project.notes}</p>
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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const columns = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      items: projects.filter(p => p.status === col.id),
    }))
  }, [projects])

  const activeProject = useMemo(() => projects.find(p => p.id === activeId), [activeId, projects])

  function findColumn(id) {
    return COLUMNS.find(col => projects.filter(p => p.status === col.id).some(p => p.id === id))
  }

  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over) return
    const targetColId = over.id
    const isCol = COLUMNS.some(c => c.id === targetColId)
    if (isCol) {
      onStatusChange(active.id, { status: targetColId })
      return
    }
    const sourceCol = findColumn(active.id)
    const destCol = findColumn(over.id)
    if (destCol && sourceCol?.id !== destCol?.id) {
      onStatusChange(active.id, { status: destCol.id })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 h-full overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {columns.map(col => (
            <div
              key={col.id}
              id={col.id}
              className="w-72 flex flex-col bg-slate-50 rounded-2xl border border-slate-100"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
                <span className={`w-2 h-2 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold text-slate-700">{STATUS_LABELS[col.id]}</h3>
                <span className="ml-auto text-xs text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full">
                  {col.items.length}
                </span>
              </div>
              <SortableContext items={col.items.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <div className="p-3 flex flex-col gap-2 flex-1 min-h-24">
                  {col.items.map(p => (
                    <SortableCard key={p.id} project={p} onEdit={onEdit} />
                  ))}
                  {col.items.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-xs text-slate-300 border-2 border-dashed border-slate-200 rounded-xl py-8">
                      Drop here
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeProject && <ProjectCard project={activeProject} onEdit={() => {}} />}
      </DragOverlay>
    </DndContext>
  )
}
