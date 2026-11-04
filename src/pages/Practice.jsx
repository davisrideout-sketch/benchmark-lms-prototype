import { Link } from 'react-router-dom'
import { Sparkles, Clock, Play, History } from 'lucide-react'
import { useApp } from '../store.jsx'
import { PageTitle } from '../components/bits.jsx'
import { scenarios, scenarioById, skills, skillKeys, rating } from '../data/practice.js'

export const AiBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600">
    <Sparkles size={14} aria-hidden="true" /> Live AI mode – coming soon
  </span>
)

export default function Practice() {
  const { practice } = useApp()
  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle title="Practice Arena" sub="Role-play real conversations in a safe space. Replies are scripted for this prototype; no AI is used and nothing is sent anywhere." />
      <div className="mb-6"><AiBadge /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        {scenarios.map((s) => {
          const runs = practice.filter((r) => r.sid === s.id)
          const best = runs.length ? Math.max(...runs.map((r) => r.overall)) : null
          return (
            <div key={s.id} className="flex flex-col rounded-2xl border border-taupe-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">{s.persona.initials}</span>
                <div className="min-w-0"><p className="text-sm font-bold">{s.persona.name}</p><p className="truncate text-xs text-taupe-700">{s.persona.role}</p></div>
              </div>
              <h2 className="text-lg font-bold leading-snug">{s.title}</h2>
              <p className="mt-1 flex-1 text-sm text-taupe-700">{s.blurb}</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-taupe-700">
                <span className="rounded-full bg-taupe-100 px-2 py-0.5">{s.level}</span>
                <span className="inline-flex items-center gap-1"><Clock size={13} aria-hidden="true" /> ~{s.mins} min</span>
                <span>{runs.length ? `${runs.length} attempt${runs.length > 1 ? 's' : ''} · best ${best}%` : 'Not attempted'}</span>
              </p>
              <Link to={`/practice/${s.id}`} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white hover:bg-brand-600">
                <Play size={15} aria-hidden="true" /> {runs.length ? 'Practise again' : 'Start scenario'}
              </Link>
            </div>
          )
        })}
      </div>

      <h2 className="mb-3 mt-10 flex items-center gap-2 text-xl font-bold"><History size={20} aria-hidden="true" /> Practice history</h2>
      {practice.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-taupe-300 p-8 text-center text-taupe-700">No practice yet. Finish a scenario to see your scorecards here.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-taupe-200 bg-white">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-taupe-100 text-xs uppercase text-taupe-700"><tr>
              <th className="p-3">Scenario</th><th className="p-3">Date</th>
              {skillKeys.map((k) => <th key={k} className="p-3">{skills[k].label}</th>)}
              <th className="p-3">Overall</th></tr></thead>
            <tbody>
              {practice.map((r) => (
                <tr key={r.at} className="border-t border-taupe-100">
                  <td className="p-3 font-semibold">{scenarioById(r.sid)?.title}</td>
                  <td className="p-3 whitespace-nowrap">{new Date(r.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                  {skillKeys.map((k) => <td key={k} className="p-3">{r.scores[k] === null ? '–' : `${r.scores[k]}%`}</td>)}
                  <td className="p-3 font-bold">{r.overall}% <span className="font-normal text-taupe-700">{rating(r.overall)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
