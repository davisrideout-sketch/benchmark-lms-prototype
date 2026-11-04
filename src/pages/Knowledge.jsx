import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText } from 'lucide-react'
import { PageTitle } from '../components/bits.jsx'
import { articles, articleCats } from '../data/articles.js'

export default function Knowledge() {
  const [q, setQ] = useState(''), [cat, setCat] = useState('')
  const term = q.trim().toLowerCase()
  const match = (a) => (!cat || a.cat === cat) &&
    (!term || `${a.title} ${a.summary} ${a.sections.map((s) => s.h + ' ' + s.p).join(' ')}`.toLowerCase().includes(term))
  const groups = articleCats.map((c) => [c, articles.filter((a) => a.cat === c && match(a))]).filter(([, l]) => l.length)
  const total = groups.reduce((n, [, l]) => n + l.length, 0)
  const chip = (on) => `rounded-full border px-3 py-1 text-sm font-semibold ${on ? 'border-brand-500 bg-brand-500 text-white' : 'border-taupe-200 bg-white text-taupe-700 hover:border-brand-500'}`

  return (
    <div className="mx-auto max-w-5xl">
      <PageTitle title="Knowledge Base" sub={`${articles.length} short sample articles. Illustrative only, not official Benchmark policy.`} />
      <label className="relative mb-4 block">
        <Search size={16} className="absolute left-3 top-3 text-taupe-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" aria-label="Search articles"
          className="w-full rounded-xl border border-taupe-200 bg-white py-2 pl-9 pr-3 text-sm" />
      </label>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button className={chip(!cat)} aria-pressed={!cat} onClick={() => setCat('')}>All</button>
        {articleCats.map((c) => <button key={c} className={chip(cat === c)} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      {total === 0 && <p className="rounded-2xl border border-dashed border-taupe-300 p-8 text-center text-taupe-700">No articles match your search.</p>}
      {groups.map(([c, list]) => (
        <section key={c} className="mb-8">
          <h2 className="mb-3 text-lg font-bold">{c}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {list.map((a) => (
              <Link key={a.id} to={`/knowledge/${a.id}`} className="group flex gap-3 rounded-2xl border border-taupe-200 bg-white p-4 shadow-sm transition hover:border-brand-500 hover:shadow-md">
                <FileText size={20} className="mt-0.5 shrink-0 text-brand-500" />
                <div>
                  <h3 className="text-base font-bold leading-snug group-hover:text-brand-600">{a.title}</h3>
                  <p className="mt-1 text-sm text-taupe-700">{a.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
