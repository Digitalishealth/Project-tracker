import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { BUCKETS, PRIORITIES, STATUSES, STATUS_LABELS } from '../../constants/enums'

const EMPTY = {
  name: '',
  bucket: 'CSO',
  priority: 'High',
  startDate: '',
  endDate: '',
  status: 'Active',
  notes: '',
  progress: 0,
}

export default function ProjectModal({ isOpen, onClose, onSave, onDelete, project }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setForm(project ? { ...EMPTY, ...project } : EMPTY)
    setErrors({})
  }, [project, isOpen])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Project name is required'
    if (!form.bucket) e.bucket = 'Bucket is required'
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = 'End date must be after start date'
    }
    return e
  }

  function handleSave() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave({ ...form, progress: Number(form.progress) || 0 })
    onClose()
  }

  function handleDelete() {
    if (onDelete) { onDelete(project.id); onClose() }
  }

  const progress = Number(form.progress) || 0

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-xl p-6 my-4">
          <Dialog.Title className="text-lg font-semibold text-slate-900 mb-5">
            {project ? 'Edit Project' : 'New Project'}
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
              <input
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. BINDER manuscript"
                autoFocus
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bucket *</label>
                <select
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.bucket ? 'border-red-400' : 'border-slate-200'}`}
                  value={form.bucket}
                  onChange={e => set('bucket', e.target.value)}
                >
                  {BUCKETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.bucket && <p className="text-xs text-red-500 mt-1">{errors.bucket}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={form.priority}
                  onChange={e => set('priority', e.target.value)}
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={form.startDate}
                  onChange={e => set('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.endDate ? 'border-red-400' : 'border-slate-200'}`}
                  value={form.endDate}
                  onChange={e => set('endDate', e.target.value)}
                />
                {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Progress — <span className="font-semibold text-teal-600">{progress}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progress}
                  onChange={e => set('progress', e.target.value)}
                  className="w-full h-2 accent-teal-600 cursor-pointer mt-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
              <textarea
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                rows={3}
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Optional notes..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div>
              {project && (
                <button
                  onClick={handleDelete}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors duration-150 ease-out"
                >
                  Delete project
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150 ease-out"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-150 ease-out"
              >
                {project ? 'Save changes' : 'Add project'}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
