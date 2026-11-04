import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronLeft, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react'
import { useApp } from '../store.jsx'
import { articleById, articles, slug } from '../data/articles.js'
import { courseById } from '../data/courses.js'

export default function Article() {
  const { aid } = useParams()
  const { vote, setVote } = useApp()
  const a = articleById(aid)
  if (!a) return <Navigate to="/knowledge" replace />
  const v = vote(a.id)
  const related = a.courses.map(courseById).filter(Boolean)
  const more = articles.filter((x) => x.cat === a.cat && x.id !== a.id).slice(0, 3)
  const btn = (on) => `flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${on ? 'border-brand-500 bg-brand-500 text-white' : 'border-taupe-200 bg-white hover:border-brand-500'}`

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/knowledge" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ChevronLeft size={16} />Knowledge Base</Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
        <article className="rounded-2xl border border-taupe-200 bg-white p-6 sm:p-8">
          <span className="text-xs font-semibold uppercase tracking-wide text-taupe-500">{a.cat}</span>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{a.title}</h1>
          <p className="mt-2 text-taupe-700">{a.summary}</p>
          <nav aria-label="Table of contents" className="mt-5 rounded-xl bg-taupe-50 p-4">
            <div className="mb-2 text-sm font-bold">In this article</div>
            <ol className="list-inside list-decimal space-y-1 text-sm">
              {a.sections.map((s) => <li key={s.h}><a href={`#${slug(s.h)}`} onClick={(e) => { e.preventDefault(); document.getElementById(slug(s.h))?.scrollIntoView({ behavior: 'smooth' }) }} className="font-semibold text-brand-600 hover:underline">{s.h}</a></li>)}
            </ol>
          </nav>
          {a.sections.map((s) => (
            <section key={s.h} className="mt-6">
              <h2 id={slug(s.h)} className="scroll-mt-20 text-lg font-bold">{s.h}</h2>
              <p className="mt-2 leading-relaxed">{s.p}</p>
            </section>
          ))}
          <div className="mt-8 border-t border-taupe-100 pt-5" role="group" aria-label="Was this helpful?">
            <div className="mb-2 text-sm font-bold">Was this helpful?</div>
            <div className="flex gap-3">
              <button className={btn(v === 'yes')} aria-pressed={v === 'yes'} onClick={() => setVote(a.id, v === 'yes' ? null : 'yes')}><ThumbsUp size={16} />Yes</button>
              <button className={btn(v === 'no')} aria-pressed={v === 'no'} onClick={() => setVote(a.id, v === 'no' ? null : 'no')}><ThumbsDown size={16} />No</button>
            </div>
            {v && <p role="status" className="mt-2 text-sm text-taupe-700">{v === 'yes' ? 'Thanks for the feedback.' : 'Thanks. In a live system this would go to the content owner.'}</p>}
          </div>
          <p className="mt-6 text-xs text-taupe-500">Illustrative sample content, not official Benchmark policy or legal advice.</p>
        </article>
        <aside className="space-y-6">
          {related.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-taupe-700">Related courses</h2>
              <div className="space-y-2">
                {related.map((c) => (
                  <Link key={c.id} to={`/course/${c.id}`} className="flex gap-2 rounded-xl border border-taupe-200 bg-white p-3 text-sm font-semibold hover:border-brand-500">
                    <BookOpen size={16} className="mt-0.5 shrink-0 text-brand-500" />{c.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {more.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-taupe-700">More in {a.cat}</h2>
              <ul className="space-y-1 text-sm">{more.map((x) => <li key={x.id}><Link to={`/knowledge/${x.id}`} className="font-semibold text-brand-600 hover:underline">{x.title}</Link></li>)}</ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
