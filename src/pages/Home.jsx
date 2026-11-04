import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Link } from 'react-router-dom'
import { PlayCircle, CheckCircle2, AlertTriangle, Clock, Trophy, ArrowRight } from 'lucide-react'
import { useApp, statusOf, fmtDate, daysUntil } from '../store.jsx'
import { courseById, courseMinutes } from '../data/courses.js'
import { personById } from '../data/people.js'

const STATUS = {
  completed: { label: 'Completed', color: '#60529c', pill: 'bg-brand-50 text-brand-600' },
  'in-progress': { label: 'In progress', color: '#a39384', pill: 'bg-taupe-100 text-taupe-700' },
  'not-started': { label: 'Not started', color: '#ddd5ce', pill: 'bg-slate-100 text-slate-600' },
  overdue: { label: 'Overdue', color: '#c2410c', pill: 'bg-orange-100 text-orange-800' },
}

function Card({ title, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-taupe-200 bg-white p-5 shadow-sm ${className}`}>
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {children}
    </section>
  )
}

export default function Home() {
  const { user, enrollments } = useApp()
  const mine = useMemo(() => enrollments.filter((e) => e.userId === user.id).map((e) => ({ ...e, course: courseById(e.courseId), status: statusOf(e) })), [enrollments, user.id])

  const counts = Object.keys(STATUS).map((k) => ({ key: k, ...STATUS[k], value: mine.filter((e) => e.status === k).length }))
  const done = mine.filter((e) => e.status === 'completed')
  const avg = done.length ? Math.round(done.reduce((s, e) => s + e.quizScore, 0) / done.length) : null
  const pct = Math.round((done.length / mine.length) * 100)
  const assigned = mine.filter((e) => e.status !== 'completed').sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const continuing = mine.filter((e) => e.completedModules > 0 && e.status !== 'completed').sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? '')).slice(0, 3)
  const activity = mine.filter((e) => e.lastActivity).sort((a, b) => b.lastActivity.localeCompare(a.lastActivity)).slice(0, 6)
  const manager = personById(user.managerId)

  const tiles = [
    { label: 'Overall progress', value: `${pct}%`, icon: Trophy, tint: 'bg-brand-50 text-brand-500' },
    { label: 'Completed', value: `${done.length} / ${mine.length}`, icon: CheckCircle2, tint: 'bg-emerald-50 text-emerald-600' },
    { label: 'Average quiz score', value: avg ? `${avg}%` : '–', icon: Clock, tint: 'bg-taupe-100 text-taupe-700' },
    { label: 'Overdue', value: counts[3].value, icon: AlertTriangle, tint: 'bg-orange-50 text-orange-600' },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="mt-1 text-taupe-700">{user.title} · {user.division} · {user.office}{manager && ` · Manager: ${manager.name}`}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="rounded-2xl border border-taupe-200 bg-white p-4 shadow-sm">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}><Icon size={20} /></span>
            <div className="mt-3 text-2xl font-bold">{value}</div>
            <div className="text-xs font-semibold text-taupe-700">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Continue learning" className="lg:col-span-2">
          {continuing.length === 0 && <p className="text-sm text-taupe-700">Nothing in progress. Start a course from your assigned list below.</p>}
          <div className="space-y-3">
            {continuing.map((e) => {
              const n = e.course.modules.length
              const next = e.course.modules[e.completedModules]
              return (
                <div key={e.courseId} className="flex flex-col gap-3 rounded-xl border border-taupe-100 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wide text-taupe-500">{e.course.category}</div>
                    <div className="font-bold">{e.course.title}</div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-taupe-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(e.completedModules / n) * 100}%` }} /></div>
                    <div className="mt-1 text-xs text-taupe-700">{e.completedModules} of {n} modules · Next: {next.title}</div>
                  </div>
                  <Link to={`/course/${e.courseId}/module/${e.completedModules}`} className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600">
                    <PlayCircle size={18} /> Continue
                  </Link>
                </div>
              )
            })}
          </div>
        </Card>

        <Card title="Progress breakdown">
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={counts.filter((c) => c.value)} dataKey="value" nameKey="label" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="none">
                  {counts.filter((c) => c.value).map((c) => <Cell key={c.key} fill={c.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {counts.map((c) => (
              <li key={c.key} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: c.color }} />{c.label}<span className="ml-auto font-bold">{c.value}</span></li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Assigned courses" className="lg:col-span-2">
          {assigned.length === 0 && <p className="text-sm text-taupe-700">All caught up. Nice work.</p>}
          <ul className="divide-y divide-taupe-100">
            {assigned.map((e) => {
              const d = daysUntil(e.dueDate)
              return (
                <li key={e.courseId} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold">{e.course.title}{e.course.mandatory && <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600">Mandatory</span>}</div>
                    <div className="text-xs text-taupe-700">{e.course.category} · {courseMinutes(e.course)} min · {e.course.modules.length} modules</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS[e.status].pill}`}>{STATUS[e.status].label}</span>
                  <div className={`w-32 text-right text-xs font-semibold ${d < 0 ? 'text-orange-700' : 'text-taupe-700'}`}>
                    Due {fmtDate(e.dueDate)}<div className="font-normal">{d < 0 ? `${-d} days overdue` : d === 0 ? 'today' : `in ${d} days`}</div>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card title="Recent activity">
          <ul className="space-y-4">
            {activity.map((e) => (
              <li key={e.courseId} className="flex gap-3">
                <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${e.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-50 text-brand-500'}`}>
                  {e.status === 'completed' ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                </span>
                <div className="text-sm">
                  <div className="font-semibold leading-snug">{e.status === 'completed' ? 'Completed' : 'Progressed in'} {e.course.title}</div>
                  <div className="text-xs text-taupe-700">{fmtDate(e.lastActivity)}{e.quizScore ? ` · Quiz ${e.quizScore}%` : ''}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
