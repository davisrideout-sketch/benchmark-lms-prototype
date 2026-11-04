import { useEffect, useRef, useState } from 'react'
import { X, ArrowLeft, ArrowRight, GraduationCap, Users, ShieldCheck, Compass, HelpCircle, LogOut, RotateCcw } from 'lucide-react'
import { people, demoUsers } from '../data/people.js'

export const TOUR_KEY = 'blms.tour.v1'
export const tourSeen = () => { try { return localStorage.getItem(TOUR_KEY) === 'true' } catch { return true } }
const markSeen = () => { try { localStorage.setItem(TOUR_KEY, 'true') } catch { /* ignore */ } }
const who = (k) => people.find((p) => p.id === demoUsers[k])

const roles = [
  { key: 'learner', icon: GraduationCap, title: 'Learner', sees: 'Their own courses, due dates, quizzes, certificates, practice and achievements.' },
  { key: 'manager', icon: Users, title: 'Manager', sees: 'Everything a learner sees, plus Reports for their team: completion, scores, overdue learning and weak topics.' },
  { key: 'admin', icon: ShieldCheck, title: 'Admin', sees: 'Everything above across the whole organisation, plus Admin: users, assignments and course statistics.' },
]

const steps = [
  { title: 'Welcome to the Benchmark LMS prototype', body: () => (
    <>
      <p>This is a clickable preview of a learning platform for Benchmark staff. It takes about five minutes to explore.</p>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        <li>There is no real login: you pick a fictional person.</li>
        <li>All people and data are fictional, and course content is illustrative sample material, not official Benchmark policy.</li>
        <li>Nothing leaves your browser. Your progress is saved on this device only.</li>
      </ul>
    </>) },
  { title: 'Three demo roles', body: () => (
    <>
      <p>Each role sees a different version of the platform. You can switch at any time.</p>
      <ul className="mt-3 space-y-3">
        {roles.map(({ key, icon: Icon, title, sees }) => (
          <li key={key} className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500"><Icon size={18} aria-hidden="true" /></span>
            <span><b>{title}</b> <span className="text-taupe-700">({who(key).name}, {who(key).title})</span><br /><span className="text-sm">{sees}</span></span>
          </li>
        ))}
      </ul>
    </>) },
  { title: 'Suggested route', body: () => (
    <>
      <p>For the quickest tour, follow these three stops. The full script is in DEMO.md.</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li><b>As the Learner:</b> open <i>For Me</i>, continue a course, pass a module quiz and view the certificate.</li>
        <li><b>Still as the Learner:</b> open <i>Practice Arena</i>, run a scenario and read the scorecard.</li>
        <li><b>As the Manager:</b> open <i>Reports</i> for team completion, overdue learning and the skills heatmap.</li>
      </ol>
    </>) },
  { title: 'Good to know', body: () => (
    <ul className="space-y-3">
      <li className="flex gap-3"><LogOut size={18} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" /><span>The <b>exit icon</b> in the top bar switches to another demo user.</span></li>
      <li className="flex gap-3"><RotateCcw size={18} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" /><span>The <b>reset icon</b> clears your demo progress so you can start fresh.</span></li>
      <li className="flex gap-3"><HelpCircle size={18} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" /><span>Press <b>Start here</b> in the top bar to see this guide again.</span></li>
      <li className="flex gap-3"><Compass size={18} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" /><span>Practice Arena replies are scripted for this prototype. No AI is called.</span></li>
    </ul>) },
]

export default function Tour({ onClose }) {
  const [i, setI] = useState(0)
  const ref = useRef(null)
  const last = i === steps.length - 1
  const close = () => { markSeen(); onClose() }
  useEffect(() => {
    const prev = document.activeElement
    ref.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && ref.current) { // keep focus inside the dialog
        const f = [...ref.current.querySelectorAll('button')].filter((b) => !b.disabled)
        if (!f.length) return
        const a = f[0], z = f[f.length - 1]
        if (e.shiftKey && (document.activeElement === a || document.activeElement === ref.current)) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prev?.focus?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const S = steps[i]
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tour-title"
        className="flex max-h-[92vh] w-full max-w-xl flex-col rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 px-6 pt-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-500">Start here · {i + 1} of {steps.length}</p>
            <h2 id="tour-title" className="mt-1 text-xl font-bold sm:text-2xl">{S.title}</h2>
          </div>
          <button onClick={close} aria-label="Close guide" className="rounded-lg p-2 text-taupe-700 hover:bg-taupe-100"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-4 text-taupe-700 [&_b]:text-ink [&_i]:text-ink">{S.body()}</div>
        <div className="flex items-center justify-between gap-3 border-t border-taupe-100 px-6 py-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {steps.map((_, k) => <span key={k} className={`h-2 rounded-full transition-all ${k === i ? 'w-6 bg-brand-500' : 'w-2 bg-taupe-200'}`} />)}
          </div>
          <div className="flex gap-2">
            {i > 0 ? <button onClick={() => setI(i - 1)} className="inline-flex items-center gap-1 rounded-xl border border-taupe-200 px-3 py-2 text-sm font-bold hover:bg-taupe-50"><ArrowLeft size={16} aria-hidden="true" /> Back</button>
              : <button onClick={close} className="rounded-xl px-3 py-2 text-sm font-semibold text-taupe-700 hover:bg-taupe-50">Skip</button>}
            <button onClick={() => (last ? close() : setI(i + 1))} className="inline-flex items-center gap-1 rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600">
              {last ? 'Got it' : <>Next <ArrowRight size={16} aria-hidden="true" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function StartHereButton({ light = false, compact = false, className = '' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Start here: open the welcome guide" className={`inline-flex items-center gap-1.5 rounded-full ${compact ? 'p-2 sm:px-3 sm:py-1.5' : 'px-3 py-1.5'} text-xs font-bold ${light ? 'bg-brand-50 text-brand-600 hover:bg-brand-100' : 'text-brand-600 hover:bg-brand-50'} ${className}`}>
        <HelpCircle size={compact ? 18 : 16} aria-hidden="true" /> <span className={compact ? 'hidden sm:inline' : ''}>Start here</span>
      </button>
      {open && <Tour onClose={() => setOpen(false)} />}
    </>
  )
}
