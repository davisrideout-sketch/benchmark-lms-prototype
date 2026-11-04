import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Clock, Star, Layers } from 'lucide-react'
import { useApp } from '../store.jsx'
import { courses, categories, courseMinutes } from '../data/courses.js'
import { divisionsOf, divisionFilters, levels, ratingOf } from '../data/learning.js'
import { FavButton, Bar, PageTitle, progressPct } from '../components/bits.jsx'

const sel = 'rounded-xl border border-taupe-200 bg-white px-3 py-2 text-sm font-semibold'

export default function Catalogue() {
  const { user, enrollments } = useApp()
  const [q, setQ] = useState(''), [cat, setCat] = useState(''), [div, setDiv] = useState(''), [lvl, setLvl] = useState('')
  const mine = useMemo(() => Object.fromEntries(enrollments.filter((e) => e.userId === user.id).map((e) => [e.courseId, e])), [enrollments, user.id])
  const list = courses.filter((c) =>
    (!cat || c.category === cat) && (!lvl || c.level === lvl) &&
    (!div || divisionsOf[c.id].includes(div) || divisionsOf[c.id].includes('All')) &&
    (!q || `${c.title} ${c.summary}`.toLowerCase().includes(q.toLowerCase())))

  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Course Catalogue" sub={`${courses.length} illustrative sample courses. Ratings are fictional demo data.`} />
      <div className="mb-6 flex flex-wrap gap-3">
        <label className="relative min-w-60 flex-1">
          <Search size={16} className="absolute left-3 top-3 text-taupe-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses" aria-label="Search courses"
            className="w-full rounded-xl border border-taupe-200 bg-white py-2 pl-9 pr-3 text-sm" />
        </label>
        <select aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)} className={sel}><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <select aria-label="Division" value={div} onChange={(e) => setDiv(e.target.value)} className={sel}><option value="">All divisions</option>{divisionFilters.map((c) => <option key={c}>{c}</option>)}</select>
        <select aria-label="Level" value={lvl} onChange={(e) => setLvl(e.target.value)} className={sel}><option value="">All levels</option>{levels.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      {list.length === 0 && <p className="rounded-2xl border border-dashed border-taupe-300 p-8 text-center text-taupe-700">No courses match those filters.</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => {
          const e = mine[c.id], pct = progressPct(e, c)
          return (
            <Link key={c.id} to={`/course/${c.id}`} className="group flex flex-col rounded-2xl border border-taupe-200 bg-white p-5 shadow-sm transition hover:border-brand-500 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-taupe-500">{c.category}</span>
                <FavButton id={`c:${c.id}`} className="-mr-1.5 -mt-1.5" />
              </div>
              <h3 className="mt-1 text-base font-bold leading-snug group-hover:text-brand-600">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm text-taupe-700">{c.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-taupe-700">
                <span className="flex items-center gap-1"><Clock size={14} />{courseMinutes(c)} min</span>
                <span className="flex items-center gap-1"><Layers size={14} />{c.modules.length} modules</span>
                <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-500" />{ratingOf(c.id)}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded bg-taupe-100 px-2 py-0.5 text-[11px] font-bold text-taupe-700">{c.level}</span>
                {c.mandatory && <span className="rounded bg-brand-50 px-2 py-0.5 text-[11px] font-bold uppercase text-brand-600">Mandatory</span>}
              </div>
              <div className="mt-4">
                {e ? <><Bar value={pct} /><div className="mt-1 text-xs text-taupe-700">{pct === 100 ? 'Completed' : `${pct}% complete`}</div></>
                  : <div className="text-xs font-semibold text-brand-600">Not started · Open course</div>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
