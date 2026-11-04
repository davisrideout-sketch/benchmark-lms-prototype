import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { BarChart, Bar as RBar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp, fmtDate } from '../store.jsx'
import { PageTitle } from '../components/bits.jsx'
import { Card, Kpi, Heatmap, Footnote } from '../components/Insights.jsx'
import { scopePeople, buildRows, summarise, byCourse, byDivision, monthlyTrend, activeRecently, heatmap, toCsv, download } from '../lib/insights.js'

const PURPLE = '#60529c', INK = '#2b2b2b'
const tick = { fontSize: 12, fill: '#6f6358' }

export default function Reports() {
  const { user, enrollments } = useApp()
  const [division, setDivision] = useState('All')
  const scope = useMemo(() => scopePeople(user).filter((p) => division === 'All' || p.division === division), [user, division])
  const rows = useMemo(() => buildRows(enrollments, scope), [enrollments, scope])
  const s = summarise(rows)
  const courseData = useMemo(() => byCourse(rows), [rows])
  const divData = useMemo(() => byDivision(rows), [rows])
  const trend = useMemo(() => monthlyTrend(rows), [rows])
  const heat = useMemo(() => heatmap(rows), [rows])
  const overdue = useMemo(() => rows.filter((r) => r.status === 'overdue')
    .sort((a, b) => a.course.title.localeCompare(b.course.title) || a.person.name.localeCompare(b.person.name)), [rows])
  const staff = useMemo(() => scope.slice().sort((a, b) => a.name.localeCompare(b.name)), [scope])
  const isAdmin = user.role === 'admin'

  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Training insights" sub={isAdmin ? 'Learning activity across the whole organisation.' : `Learning activity for your team (${scope.length} people).`} />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {isAdmin && (
          <label className="text-sm font-semibold">Division{' '}
            <select value={division} onChange={(e) => setDivision(e.target.value)} className="ml-1 rounded-lg border border-taupe-300 bg-white px-3 py-2 text-sm font-normal">
              {['All', 'Deal Origination', 'Deal Transaction', 'Central'].map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
        )}
        <button type="button" onClick={() => download(`training-insights-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows))}
          className="ml-auto inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600">
          <Download size={16} /> Export CSV
        </button>
      </div>
      {rows.length === 0 ? <p className="rounded-2xl border border-taupe-200 bg-white p-6 text-sm text-taupe-700">No learning records in this view.</p> : (<>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Completion rate" value={`${s.rate}%`} sub={`${s.completed} of ${s.total} assignments`} />
          <Kpi label="Average quiz score" value={s.avgScore == null ? '–' : `${s.avgScore}%`} sub="completed courses" />
          <Kpi label="Overdue assignments" value={s.overdue} sub="past their due date" warn={s.overdue > 0} />
          <Kpi label="Active, last 14 days" value={activeRecently(rows)} sub={`of ${scope.length} people`} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="Activity trend" sub="Courses completed per month, last six months.">
            <div className="h-64" role="img" aria-label="Line chart of courses completed per month">
              <ResponsiveContainer>
                <LineChart data={trend} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#ece8e4" vertical={false} />
                  <XAxis dataKey="month" tick={tick} /><YAxis allowDecimals={false} tick={tick} />
                  <Tooltip />
                  <Line type="monotone" dataKey="completions" name="Completions" stroke={PURPLE} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Completion by division" sub="Share of assignments completed.">
            <div className="h-64" role="img" aria-label="Bar chart of completion rate by division">
              <ResponsiveContainer>
                <BarChart data={divData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#ece8e4" vertical={false} />
                  <XAxis dataKey="name" tick={tick} /><YAxis domain={[0, 100]} unit="%" tick={tick} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <RBar dataKey="rate" name="Completion rate" fill={PURPLE} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="mt-4" title="Completion by course" sub="Share of assignments completed, per course.">
          <div style={{ height: courseData.length * 34 + 30 }} role="img" aria-label="Bar chart of completion rate by course">
            <ResponsiveContainer>
              <BarChart data={courseData} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid stroke="#ece8e4" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={tick} />
                <YAxis type="category" dataKey="short" width={210} tick={{ ...tick, fill: INK }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <RBar dataKey="rate" name="Completion rate" fill={PURPLE} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="mt-4" title="Skills heatmap" sub="Where training may need to be strengthened.">
          <Heatmap data={heat} />
        </Card>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title={`Overdue assignments (${overdue.length})`} sub="Grouped by course, then name. Use it to offer support, not to judge.">
            {overdue.length === 0 ? <p className="text-sm text-taupe-700">Nothing is overdue.</p> : (
              <ul className="max-h-80 divide-y divide-taupe-100 overflow-y-auto text-sm">
                {overdue.map((r) => (
                  <li key={`${r.userId}:${r.courseId}`} className="flex flex-wrap items-center justify-between gap-x-3 py-2">
                    <span><Link to={`/reports/${r.userId}`} className="font-bold hover:text-brand-600">{r.person.name}</Link> <span className="text-taupe-700">· {r.course.title}</span></span>
                    <span className="text-xs font-semibold text-orange-700">due {fmtDate(r.dueDate)} ({r.daysOverdue}d)</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Learning history by employee" sub="Listed alphabetically. Open one to see their own course history.">
            <ul className="grid max-h-80 grid-cols-1 gap-1 overflow-y-auto text-sm sm:grid-cols-2">
              {staff.map((p) => (
                <li key={p.id}><Link to={`/reports/${p.id}`} className="block rounded-lg px-2 py-1.5 hover:bg-taupe-100"><b>{p.name}</b><span className="block text-xs text-taupe-700">{p.title}</span></Link></li>
              ))}
            </ul>
          </Card>
        </div>
      </>)}
      <Footnote />
    </div>
  )
}
