export const BUCKETS = [
  'Health Policy',
  'CSO',
  'PhD',
  'Time Toxicity (Non-PhD)',
]

export const PRIORITIES = ['High', 'Medium-High', 'Medium', 'Low']

export const STATUSES = ['Active', 'Upcoming', 'Background', '', 'Complete']

export const BUCKET_COLORS = {
  'Health Policy': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
    bar: '#6366f1',
  },
  CSO: {
    bg: 'bg-teal-100',
    text: 'text-teal-700',
    dot: 'bg-teal-500',
    bar: '#14b8a6',
  },
  PhD: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
    bar: '#a855f7',
  },
  'Time Toxicity (Non-PhD)': {
    bg: 'bg-pink-100',
    text: 'text-pink-700',
    dot: 'bg-pink-500',
    bar: '#ec4899',
  },
}

export const PRIORITY_COLORS = {
  High: { bg: 'bg-red-100', text: 'text-red-700' },
  'Medium-High': { bg: 'bg-orange-100', text: 'text-orange-700' },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  Low: { bg: 'bg-gray-100', text: 'text-gray-600' },
}

export const STATUS_COLORS = {
  Active: { bg: 'bg-green-100', text: 'text-green-700' },
  Upcoming: { bg: 'bg-sky-100', text: 'text-sky-700' },
  Background: { bg: 'bg-slate-100', text: 'text-slate-600' },
  '': { bg: 'bg-gray-50', text: 'text-gray-400' },
  Complete: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
}

export const STATUS_LABELS = {
  Active: 'Active',
  Upcoming: 'Upcoming',
  Background: 'Background',
  '': 'Backlog',
  Complete: 'Complete',
}
