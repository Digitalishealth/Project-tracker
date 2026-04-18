export const BUCKETS = [
  'Health Policy',
  'CSO',
  'PhD',
  'Time Toxicity (Non-PhD)',
]

export const PRIORITIES = ['High', 'Medium-High', 'Medium', 'Low']

export const STATUSES = ['Active', 'Upcoming', 'Background', '', 'Complete']

// Brand: Teal-600 = #0d9488 (Digitalis primary)
// CSO moved from teal → emerald to free teal for brand use
export const BUCKET_COLORS = {
  'Health Policy': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    bar: '#6366f1',
  },
  CSO: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    bar: '#10b981',
  },
  PhD: {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    bar: '#a855f7',
  },
  'Time Toxicity (Non-PhD)': {
    bg: 'bg-pink-50',
    text: 'text-pink-800',
    border: 'border-pink-200',
    dot: 'bg-pink-500',
    bar: '#ec4899',
  },
}

export const PRIORITY_COLORS = {
  High: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  'Medium-High': { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  Low: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
}

export const STATUS_COLORS = {
  Active: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  Upcoming: { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  Background: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  '': { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
  Complete: { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
}

export const STATUS_LABELS = {
  Active: 'Active',
  Upcoming: 'Upcoming',
  Background: 'Background',
  '': 'Backlog',
  Complete: 'Complete',
}
