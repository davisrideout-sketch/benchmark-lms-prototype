import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, Route } from 'lucide-react'
import { useApp } from '../store.jsx'
import { paths, pathCourses } from '../data/learning.js'
import { Bar, PageTitle, progressPct } from '../components/bits.jsx'

export function pathProgress(p, mine) {
  const cs = pathCourses(p)
  const total = cs.reduce((s, c) => s + c.modules.length, 0)
  const done = cs.reduce((s, c) => s + (mine[c.id]?.completedModules ?? 0), 0)
  return { total, done, pct: Math.round((done / total) * 100), complete: cs.every((c) => (mine[c.id]?.completedModules ?? 0) >= c.modules.length) }
}

export default function Paths() {
  const { user, enrollments } = useApp()
  const mine = Object.fromEntries(enrollments.filter((e) => e.userId === user.id).map((e) => [e.courseId, e]))
  return (
    <div className="mx-auto max-w-4xl">
      <PageTitle title="Learning Paths" sub="Role-based sequences of courses. Illustrative sample paths." />
      <div className="space-y-6">
        {paths.map((p) => {
          const pr = pathProgress(p, mine), cs = pathCourses(p)
          const next = cs.find((c) => (mine[c.id]?.completedModules ?? 0) < c.modules.length)
          return (
            <section key={p.id} className="rounded-2xl border border-taupe-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500"><Route size={22} /></span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{p.title}</h2>
                  <div className="text-xs font-semibold text-taupe-500">For: {p.role}</div>
                  <p className="mt-2 text-sm text-taupe-700">{p.blurb}</p>
                </div>
                <div className="text-right text-2xl font-bold text-brand-600">{pr.pct}%</div>
              </div>
              <Bar value={pr.pct} className="mt-4" />
              <div className="mt-1 text-xs text-taupe-700">{pr.done} of {pr.total} modules complete across {cs.length} courses</div>
              <ol className="mt-4 divide-y divide-taupe-100">
                {cs.map((c, k) => {
                  const e = mine[c.id], done = e && e.completedModules >= c.modules.length
                  return (
                    <li key={c.id} className="flex items-center gap-3 py-2.5">
                      {done ? <CheckCircle2 size={20} className="shrink-0 text-emerald-600" /> : <Circle size={20} className="shrink-0 text-taupe-400" />}
                      <Link to={`/course/${c.id}`} className="min-w-0 flex-1 text-sm font-bold hover:text-brand-600">{k + 1}. {c.title}</Link>
                      <span className="text-xs font-semibold text-taupe-700">{progressPct(e, c)}%</span>
                    </li>
                  )
                })}
              </ol>
              {next
                ? <Link to={`/course/${next.id}`} className="mt-4 inline-block rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600">{pr.done ? 'Continue path' : 'Start path'}</Link>
                : <div className="mt-4 text-sm font-bold text-emerald-700">Path complete</div>}
            </section>
          )
        })}
      </div>
    </div>
  )
}
