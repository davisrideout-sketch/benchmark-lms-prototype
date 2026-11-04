import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useApp, fmtDate } from '../store.jsx'
import { personById } from '../data/people.js'
import { PageTitle, StatusPill, Bar, progressPct } from '../components/bits.jsx'
import { Footnote, Kpi } from '../components/Insights.jsx'
import { scopePeople, buildRows, summarise } from '../lib/insights.js'

export default function ReportPerson() {
  const { pid } = useParams()
  const { user, enrollments } = useApp()
  const p = personById(pid)
  if (!p || !scopePeople(user).some((x) => x.id === pid)) return <Navigate to="/reports" replace />
  const rows = buildRows(enrollments, [p]).sort((a, b) => a.course.title.localeCompare(b.course.title))
  const done = rows.filter((r) => r.status === 'completed')
  const open = rows.filter((r) => r.status !== 'completed')
  const s = summarise(rows)
  const Row = ({ r }) => (
    <li className="rounded-2xl border border-taupe-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="min-w-0 flex-1"><div className="font-bold">{r.course.title}</div><div className="text-xs text-taupe-700">{r.course.category} · {r.completedModules} of {r.course.modules.length} modules</div></div>
        <StatusPill status={r.status} />
        <div className="text-right text-xs text-taupe-700">{r.completedAt ? `Completed ${fmtDate(r.completedAt)}` : `Due ${fmtDate(r.dueDate)}`}{r.quizScore != null && <div className="font-bold text-ink">Quiz {r.quizScore}%</div>}</div>
      </div>
      {r.status !== 'completed' && <Bar value={progressPct(r, r.course)} className="mt-3" />}
    </li>
  )
  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/reports" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:underline"><ArrowLeft size={16} /> Back to training insights</Link>
      <PageTitle title={p.name} sub={`${p.title} · ${p.division} · ${p.office}`} />
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Kpi label="Completed" value={`${s.completed}/${s.total}`} />
        <Kpi label="Overdue" value={s.overdue} warn={s.overdue > 0} />
        <Kpi label="Last activity" value={rows.map((r) => r.lastActivity).filter(Boolean).sort().pop() ? fmtDate(rows.map((r) => r.lastActivity).filter(Boolean).sort().pop()) : '–'} />
      </div>
      <h2 className="mb-2 text-lg font-bold">In progress and assigned</h2>
      <ul className="mb-6 space-y-3">{open.length ? open.map((r) => <Row key={r.courseId} r={r} />) : <li className="text-sm text-taupe-700">Nothing outstanding.</li>}</ul>
      <h2 className="mb-2 text-lg font-bold">Completed</h2>
      <ul className="space-y-3">{done.length ? done.map((r) => <Row key={r.courseId} r={r} />) : <li className="text-sm text-taupe-700">No completed courses yet.</li>}</ul>
      <Footnote />
    </div>
  )
}
