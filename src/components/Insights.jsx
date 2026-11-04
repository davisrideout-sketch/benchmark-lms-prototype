import { AlertTriangle, Info } from 'lucide-react'
import { FOOTNOTE, WEAK_BELOW, MIN_N } from '../lib/insights.js'

export const Footnote = () => (
  <p className="mt-8 flex gap-2 rounded-xl border border-taupe-200 bg-white p-3 text-xs text-taupe-700"><Info size={16} className="mt-0.5 shrink-0" /><span>{FOOTNOTE}</span></p>
)

export const Kpi = ({ label, value, sub, warn }) => (
  <div className={`rounded-2xl border bg-white p-4 shadow-sm ${warn ? 'border-orange-300' : 'border-taupe-200'}`}>
    <div className="text-xs font-bold uppercase tracking-wide text-taupe-700">{label}</div>
    <div className="mt-1 font-display text-3xl font-bold">{value}</div>
    {sub && <div className="text-xs text-taupe-700">{sub}</div>}
  </div>
)

export const Card = ({ title, sub, children, className = '' }) => (
  <section className={`rounded-2xl border border-taupe-200 bg-white p-4 shadow-sm ${className}`}>
    <h2 className="text-base font-bold">{title}</h2>
    {sub && <p className="mb-3 text-xs text-taupe-700">{sub}</p>}
    {children}
  </section>
)

function cellStyle(score) {
  if (score == null) return 'bg-taupe-50 text-taupe-500'
  if (score < WEAK_BELOW) return 'bg-orange-100 text-orange-900 ring-1 ring-orange-300'
  if (score < 86) return 'bg-brand-100 text-brand-700'
  return 'bg-brand-500 text-white'
}

export function Heatmap({ data }) {
  const { cols, grid } = data
  const weak = grid.filter((g) => g.overall != null && g.overall < WEAK_BELOW)
  return (
    <>
      {weak.length > 0 && (
        <p className="mb-3 flex gap-2 rounded-xl bg-orange-50 p-3 text-sm text-orange-900">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span><b>Topics that may need more training:</b> {weak.map((w) => `${w.topic} (${w.overall}%)`).join(', ')}.</span>
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-separate border-spacing-1 text-sm">
          <thead>
            <tr className="text-left text-xs text-taupe-700">
              <th className="px-2 py-1 font-bold">Topic</th>
              {cols.map((c) => <th key={c} className="px-2 py-1 text-center font-bold">{c}</th>)}
              {cols.length > 1 && <th className="px-2 py-1 text-center font-bold">All in view</th>}
            </tr>
          </thead>
          <tbody>
            {grid.map((g) => (
              <tr key={g.id}>
                <th scope="row" className="px-2 py-1.5 text-left font-semibold">{g.topic}<div className="text-[11px] font-normal text-taupe-700">{g.category}</div></th>
                {g.cells.map((c) => <Cell key={c.division} score={c.score} n={c.n} />)}
                {cols.length > 1 && <Cell score={g.overall} n={g.n} />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-taupe-700">
        Average quiz score on completed courses. <span className="rounded bg-orange-100 px-1.5 py-0.5 font-bold text-orange-900">Below {WEAK_BELOW}%</span> is flagged as a weak topic.
        Groups with fewer than {MIN_N} results show “–” so no one person is singled out.
      </p>
    </>
  )
}
const Cell = ({ score, n }) => (
  <td className={`rounded-lg px-2 py-2 text-center font-bold ${cellStyle(score)}`} title={score == null ? `${n} result${n === 1 ? '' : 's'}: too few to show` : `${n} results`}>
    {score == null ? '–' : `${score}%`}{score != null && score < WEAK_BELOW && <span className="sr-only"> (weak topic)</span>}
  </td>
)
