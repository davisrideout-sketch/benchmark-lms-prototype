import { useMemo, useState } from 'react'
import { CheckCircle2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { useApp } from '../store.jsx'
import { people, personById } from '../data/people.js'
import { courses, categories, courseById } from '../data/courses.js'
import { levels } from '../data/learning.js'
import { TODAY } from '../data/enrollments.js'
import { PageTitle } from '../components/bits.jsx'
import { Footnote } from '../components/Insights.jsx'
import { buildRows, byCourse, teamOf } from '../lib/insights.js'

const TABS = ['Users', 'Assign a course', 'Course statistics', 'Course editor']
const field = 'rounded-lg border border-taupe-300 bg-white px-3 py-2 text-sm'
const lbl = 'block text-sm font-semibold'

export default function Admin() {
  const [tab, setTab] = useState(TABS[0])
  return (
    <div className="mx-auto max-w-6xl">
      <PageTitle title="Admin" sub="Manage people, assignments and course content (demo only, nothing leaves this browser)." />
      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === t ? 'bg-brand-500 text-white' : 'bg-white text-taupe-700 ring-1 ring-taupe-200 hover:bg-taupe-100'}`}>{t}</button>
        ))}
      </div>
      {tab === 'Users' && <Users />}
      {tab === 'Assign a course' && <Assign />}
      {tab === 'Course statistics' && <Stats />}
      {tab === 'Course editor' && <Editor />}
    </div>
  )
}

function Users() {
  const [role, setRole] = useState('all'); const [q, setQ] = useState('')
  const list = people.filter((p) => (role === 'all' || p.role === role) && `${p.name} ${p.title} ${p.division} ${p.office}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {['all', 'learner', 'manager', 'admin'].map((r) => (
          <button key={r} aria-pressed={role === r} onClick={() => setRole(r)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-bold capitalize ${role === r ? 'bg-ink text-white' : 'bg-white ring-1 ring-taupe-200 hover:bg-taupe-100'}`}>
            {r === 'all' ? 'All roles' : `${r}s`}</button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, title, office…" aria-label="Search users" className={`${field} ml-auto w-full sm:w-64`} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-taupe-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-taupe-50 text-xs uppercase tracking-wide text-taupe-700"><tr>{['Name', 'Title', 'Division', 'Office', 'Role', 'Reports to'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-taupe-100">
            {list.map((p) => (
              <tr key={p.id}><td className="px-3 py-2 font-bold">{p.name}</td><td className="px-3 py-2">{p.title}</td><td className="px-3 py-2">{p.division}</td><td className="px-3 py-2">{p.office}</td>
                <td className="px-3 py-2"><span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold capitalize text-brand-600">{p.role}</span></td>
                <td className="px-3 py-2 text-taupe-700">{p.managerId ? personById(p.managerId).name : '–'}</td></tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-taupe-700">No users match.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-taupe-700">{list.length} of {people.length} people. Role changes are not available in the demo.</p>
    </div>
  )
}

function Assign() {
  const { user, assignCourse } = useApp()
  const iso = (n) => new Date(TODAY + n * 86400000).toISOString().slice(0, 10)
  const [cid, setCid] = useState(courses[0].id)
  const [mode, setMode] = useState('person')
  const [pid, setPid] = useState(people.find((p) => p.role === 'learner').id)
  const [mid, setMid] = useState(people.find((p) => p.role === 'manager').id)
  const [div, setDiv] = useState('Deal Origination')
  const [due, setDue] = useState(iso(30))
  const [msg, setMsg] = useState(null)
  const targets = useMemo(() => mode === 'person' ? [personById(pid)] : mode === 'team' ? teamOf(mid) : people.filter((p) => p.division === div), [mode, pid, mid, div])
  const go = (e) => {
    e.preventDefault()
    const r = assignCourse(targets.map((p) => p.id), cid, due, user.id)
    const who = mode === 'person' ? personById(pid) : null
    setMsg({ ...r, who: who ? who.name : null, course: courseById(cid).title })
  }
  return (
    <form onSubmit={go} className="max-w-2xl space-y-4 rounded-2xl border border-taupe-200 bg-white p-5 shadow-sm">
      <label className={lbl}>Course
        <select value={cid} onChange={(e) => setCid(e.target.value)} className={`${field} mt-1 w-full font-normal`}>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <fieldset><legend className={lbl}>Assign to</legend>
        <div className="mt-1 flex flex-wrap gap-4 text-sm">{[['person', 'A person'], ['team', "A manager's team"], ['division', 'A division']].map(([v, t]) => (
          <label key={v} className="inline-flex items-center gap-2"><input type="radio" name="mode" checked={mode === v} onChange={() => setMode(v)} />{t}</label>))}</div></fieldset>
      {mode === 'person' && <select aria-label="Person" value={pid} onChange={(e) => setPid(e.target.value)} className={`${field} w-full`}>{people.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.title}</option>)}</select>}
      {mode === 'team' && <select aria-label="Manager" value={mid} onChange={(e) => setMid(e.target.value)} className={`${field} w-full`}>{people.filter((p) => p.role === 'manager').map((p) => <option key={p.id} value={p.id}>{p.name}'s team ({teamOf(p.id).length})</option>)}</select>}
      {mode === 'division' && <select aria-label="Division" value={div} onChange={(e) => setDiv(e.target.value)} className={`${field} w-full`}>{['Deal Origination', 'Deal Transaction', 'Central'].map((d) => <option key={d}>{d}</option>)}</select>}
      <label className={lbl}>Due date<input type="date" value={due} onChange={(e) => setDue(e.target.value)} required className={`${field} mt-1 block`} /></label>
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600">Assign to {targets.length} {targets.length === 1 ? 'person' : 'people'}</button>
        {targets.length === 0 && <span className="text-sm text-orange-700">No one in this selection.</span>}
      </div>
      {msg && (
        <p role="status" className="flex gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span><b>{msg.added} assigned</b>{msg.skipped > 0 && `, ${msg.skipped} already had “${msg.course}”`}. {msg.added > 0 && `It now appears under “Assigned to me” on For Me. ${msg.who ? `Sign in as ${msg.who} to see it.` : 'Sign in as one of those people to see it.'}`}</span></p>
      )}
    </form>
  )
}

function Stats() {
  const { enrollments } = useApp()
  const data = useMemo(() => byCourse(buildRows(enrollments, people)), [enrollments])
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-taupe-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-taupe-50 text-xs uppercase tracking-wide text-taupe-700"><tr>{['Course', 'Category', 'Assigned', 'Completed', 'Completion', 'Avg quiz', 'Overdue'].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-taupe-100">
            {data.map((d) => { const c = courseById(d.id); return (
              <tr key={d.id}><td className="px-3 py-2 font-bold">{d.name}{c.mandatory && <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600">Mandatory</span>}</td>
                <td className="px-3 py-2">{c.category}</td><td className="px-3 py-2">{d.total}</td><td className="px-3 py-2">{d.completed}</td>
                <td className="px-3 py-2"><div className="flex items-center gap-2"><div className="h-2 w-20 overflow-hidden rounded-full bg-taupe-100"><div className="h-full bg-brand-500" style={{ width: `${d.rate}%` }} /></div>{d.rate}%</div></td>
                <td className="px-3 py-2">{d.avgScore == null ? '–' : `${d.avgScore}%`}</td><td className={`px-3 py-2 ${d.overdue ? 'font-bold text-orange-700' : ''}`}>{d.overdue}</td></tr>) })}
          </tbody>
        </table>
      </div>
      <Footnote />
    </div>
  )
}

const DKEY = 'blms.drafts.v1'
const loadDrafts = () => { try { return JSON.parse(localStorage.getItem(DKEY)) ?? {} } catch { return {} } }
function Editor() {
  const [cid, setCid] = useState(courses[0].id)
  const fresh = (id) => { const c = courseById(id); return loadDrafts()[id] ?? { title: c.title, summary: c.summary, category: c.category, level: c.level, mandatory: c.mandatory, modules: c.modules.map((m) => ({ ...m })) } }
  const [draft, setDraft] = useState(() => fresh(courses[0].id))
  const [saved, setSaved] = useState(false)
  const pick = (id) => { setCid(id); setDraft(fresh(id)); setSaved(false) }
  const set = (k, v) => { setDraft((d) => ({ ...d, [k]: v })); setSaved(false) }
  const setMod = (i, patch) => set('modules', draft.modules.map((m, j) => (j === i ? { ...m, ...patch } : m)))
  const move = (i, dir) => { const m = [...draft.modules]; const j = i + dir; if (j < 0 || j >= m.length) return; [m[i], m[j]] = [m[j], m[i]]; set('modules', m) }
  const save = (e) => { e.preventDefault(); try { localStorage.setItem(DKEY, JSON.stringify({ ...loadDrafts(), [cid]: draft })) } catch { /* ignore */ } setSaved(true) }
  const reset = () => { try { const d = loadDrafts(); delete d[cid]; localStorage.setItem(DKEY, JSON.stringify(d)) } catch { /* ignore */ } const c = courseById(cid); setDraft({ title: c.title, summary: c.summary, category: c.category, level: c.level, mandatory: c.mandatory, modules: c.modules.map((m) => ({ ...m })) }); setSaved(false) }
  return (
    <form onSubmit={save} className="max-w-3xl space-y-4 rounded-2xl border border-taupe-200 bg-white p-5 shadow-sm">
      <p className="rounded-xl bg-brand-50 p-3 text-xs text-brand-700">Editor mock: drafts are saved in this browser only and do not change the live catalogue.</p>
      <label className={lbl}>Course to edit<select value={cid} onChange={(e) => pick(e.target.value)} className={`${field} mt-1 w-full font-normal`}>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label className={lbl}>Title<input value={draft.title} onChange={(e) => set('title', e.target.value)} required className={`${field} mt-1 w-full font-normal`} /></label>
      <label className={lbl}>Summary<textarea value={draft.summary} onChange={(e) => set('summary', e.target.value)} rows={2} className={`${field} mt-1 w-full font-normal`} /></label>
      <div className="flex flex-wrap gap-4">
        <label className={lbl}>Category<select value={draft.category} onChange={(e) => set('category', e.target.value)} className={`${field} mt-1 block font-normal`}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className={lbl}>Level<select value={draft.level} onChange={(e) => set('level', e.target.value)} className={`${field} mt-1 block font-normal`}>{levels.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={draft.mandatory} onChange={(e) => set('mandatory', e.target.checked)} />Mandatory</label>
      </div>
      <fieldset><legend className={lbl}>Modules</legend>
        <ol className="mt-2 space-y-2">
          {draft.modules.map((m, i) => (
            <li key={i} className="flex flex-wrap items-center gap-2 rounded-xl border border-taupe-200 p-2">
              <span className="w-6 text-center text-xs font-bold text-taupe-700">{i + 1}</span>
              <input aria-label={`Module ${i + 1} title`} value={m.title} onChange={(e) => setMod(i, { title: e.target.value })} className={`${field} min-w-0 flex-1`} />
              <select aria-label={`Module ${i + 1} type`} value={m.type} onChange={(e) => setMod(i, { type: e.target.value })} className={field}>{['Lesson', 'Practice', 'Quiz'].map((t) => <option key={t}>{t}</option>)}</select>
              <input aria-label={`Module ${i + 1} minutes`} type="number" min={1} value={m.minutes} onChange={(e) => setMod(i, { minutes: Number(e.target.value) })} className={`${field} w-20`} />
              <button type="button" aria-label="Move up" onClick={() => move(i, -1)} className="rounded p-1 hover:bg-taupe-100"><ArrowUp size={16} /></button>
              <button type="button" aria-label="Move down" onClick={() => move(i, 1)} className="rounded p-1 hover:bg-taupe-100"><ArrowDown size={16} /></button>
              <button type="button" aria-label="Remove module" onClick={() => set('modules', draft.modules.filter((_, j) => j !== i))} className="rounded p-1 text-orange-700 hover:bg-orange-50"><Trash2 size={16} /></button>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => set('modules', [...draft.modules, { title: 'New module', minutes: 10, type: 'Lesson' }])} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:underline"><Plus size={16} /> Add module</button>
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <button className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600">Save draft</button>
        <button type="button" onClick={reset} className="rounded-xl px-4 py-2.5 text-sm font-bold text-taupe-700 ring-1 ring-taupe-200 hover:bg-taupe-100">Discard draft</button>
        {saved && <span role="status" className="text-sm font-semibold text-emerald-700">Draft saved (demo only).</span>}
      </div>
    </form>
  )
}
