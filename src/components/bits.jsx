import { Star } from 'lucide-react'
import { useApp } from '../store.jsx'

export function FavButton({ id, className = '' }) {
  const { favs, toggleFav } = useApp()
  const on = favs.includes(id)
  return (
    <button type="button" aria-pressed={on} aria-label={on ? 'Remove from favourites' : 'Add to favourites'} title={on ? 'Remove from favourites' : 'Add to favourites'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(id) }}
      className={`rounded-lg p-1.5 hover:bg-taupe-100 ${className}`}>
      <Star size={18} className={on ? 'fill-amber-400 text-amber-500' : 'text-taupe-500'} />
    </button>
  )
}

export function Bar({ value, className = '' }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-taupe-100 ${className}`} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-brand-500" style={{ width: `${value}%` }} />
    </div>
  )
}

export const progressPct = (e, course) => (e ? Math.round((e.completedModules / course.modules.length) * 100) : 0)

const PILL = {
  completed: ['Completed', 'bg-emerald-50 text-emerald-700'],
  overdue: ['Overdue', 'bg-orange-100 text-orange-800'],
  'in-progress': ['In progress', 'bg-brand-50 text-brand-600'],
  'not-started': ['Not started', 'bg-slate-100 text-slate-600'],
}
export const StatusPill = ({ status }) => <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${PILL[status][1]}`}>{PILL[status][0]}</span>

export const PageTitle = ({ title, sub }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
    {sub && <p className="mt-1 text-taupe-700">{sub}</p>}
  </div>
)
