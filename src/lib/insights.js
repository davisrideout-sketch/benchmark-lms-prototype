import { people } from '../data/people.js'
import { courses, courseById } from '../data/courses.js'
import { TODAY } from '../data/enrollments.js'
import { statusOf } from '../store.jsx'
import { topicOf } from '../data/skills.js'

export const FOOTNOTE = 'Training insights are for planning learning and support only. They are not for performance, pay, promotion or disciplinary decisions. Demo data: all people are fictional.'
export const MIN_N = 2          // smallest group a score average is shown for
export const WEAK_BELOW = 78    // average quiz score (%) flagged as a weak topic

// Everyone who reports to `id`, directly or indirectly (excluding the person).
export function teamOf(id) {
  const out = []; const walk = (m) => people.filter((p) => p.managerId === m).forEach((p) => { out.push(p); walk(p.id) })
  walk(id); return out
}
export const scopePeople = (user) => (user.role === 'admin' ? people : teamOf(user.id))

const avg = (xs) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

export function summarise(rows) {
  const done = rows.filter((r) => r.status === 'completed')
  const scores = done.map((r) => r.quizScore).filter((x) => x != null)
  return { total: rows.length, completed: done.length, rate: pct(done.length, rows.length),
    avgScore: scores.length >= MIN_N ? avg(scores) : null, overdue: rows.filter((r) => r.status === 'overdue').length }
}

export function buildRows(enrollments, scope) {
  const byId = Object.fromEntries(scope.map((p) => [p.id, p]))
  return enrollments.filter((e) => byId[e.userId]).map((e) => ({
    ...e, person: byId[e.userId], course: courseById(e.courseId), status: statusOf(e),
    daysOverdue: Math.max(0, Math.round((TODAY - new Date(e.dueDate).getTime()) / 86400000)),
  }))
}

export const byCourse = (rows) => courses.map((c) => {
  const r = rows.filter((x) => x.courseId === c.id); const s = summarise(r)
  return { id: c.id, name: c.title, short: c.title.length > 34 ? `${c.title.slice(0, 32)}…` : c.title, ...s }
}).filter((x) => x.total > 0)

export const byDivision = (rows) => ['Deal Origination', 'Deal Transaction', 'Central'].map((d) => ({
  name: d, ...summarise(rows.filter((r) => r.person.division === d)),
})).filter((x) => x.total > 0)

// Completions per month for the last six months (current month is part-way through).
export function monthlyTrend(rows) {
  const months = Array.from({ length: 6 }, (_, i) => { const d = new Date(TODAY); d.setDate(1); d.setMonth(d.getMonth() - (5 - i)); return d })
  return months.map((d, i) => {
    const key = d.toISOString().slice(0, 7)
    return { month: d.toLocaleDateString('en-GB', { month: 'short' }) + (i === 5 ? ' (to date)' : ''), completions: rows.filter((r) => (r.completedAt || '').slice(0, 7) === key).length }
  })
}

// People with any recorded learning activity in the last `days` days.
export const activeRecently = (rows, days = 14) => new Set(rows.filter((r) => r.lastActivity && TODAY - new Date(r.lastActivity).getTime() <= days * 86400000).map((r) => r.userId)).size

// Skills heatmap: topic x division (average quiz score). Small groups are hidden, not shown.
export function heatmap(rows) {
  const cols = ['Deal Origination', 'Deal Transaction', 'Central']
  const present = cols.filter((c) => rows.some((r) => r.person.division === c))
  const grid = courses.map((c) => {
    const cells = present.map((d) => {
      const s = rows.filter((r) => r.courseId === c.id && r.status === 'completed' && r.quizScore != null && r.person.division === d).map((r) => r.quizScore)
      return { division: d, n: s.length, score: s.length >= MIN_N ? avg(s) : null }
    })
    const all = rows.filter((r) => r.courseId === c.id && r.status === 'completed' && r.quizScore != null).map((r) => r.quizScore)
    return { id: c.id, topic: topicOf[c.id], category: c.category, cells, overall: all.length >= MIN_N ? avg(all) : null, n: all.length }
  })
  return { cols: present, grid }
}

const csvCell = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
export function toCsv(rows) {
  const head = ['Employee', 'Division', 'Office', 'Course', 'Status', 'Modules done', 'Modules total', 'Due date', 'Completed on', 'Quiz score %']
  const lines = rows.slice().sort((a, b) => a.person.name.localeCompare(b.person.name) || a.course.title.localeCompare(b.course.title))
    .map((r) => [r.person.name, r.person.division, r.person.office, r.course.title, r.status, r.completedModules, r.course.modules.length, r.dueDate, r.completedAt ?? '', r.quizScore ?? ''])
  return [head, ...lines].map((l) => l.map(csvCell).join(',')).join('\r\n')
}
export function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name }); document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}
